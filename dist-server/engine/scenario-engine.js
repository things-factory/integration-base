"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const shell_1 = require("@things-factory/shell");
const utils_1 = require("./utils");
const task_registry_1 = require("./task-registry");
const types_1 = require("./types");
const typeorm_1 = require("typeorm");
const entities_1 = require("../entities");
const cron_1 = require("cron");
const scenarios = {};
const { combine, timestamp, splat, printf } = winston_1.format;
const status = ['READY', 'STARTED', 'PAUSED', 'STOPPED', 'HALTED'];
class ScenarioEngine {
    constructor({ name, steps, schedule = '', timezone = 'Asia/Seoul' }, context, data) {
        this.rounds = 0;
        this.nextStep = 0;
        this.name = name;
        this.schedule = schedule;
        this.timezone = timezone;
        this.steps = steps || [];
        this.context = context || {
            logger: winston_1.createLogger({
                format: combine(timestamp(), splat(), ScenarioEngine.logFormat),
                transports: [
                    new winston_1.transports.DailyRotateFile({
                        filename: `logs/scenario-${name}-%DATE%.log`,
                        datePattern: 'YYYY-MM-DD-HH',
                        zippedArchive: false,
                        maxSize: '20m',
                        maxFiles: '14d',
                        level: 'info'
                    })
                ]
            }),
            publish: this.publishData.bind(this),
            load: this.loadSubscenario.bind(this),
            data: {},
            state: types_1.SCENARIO_STATE.READY
        };
        if (data) {
            this.context.data = data;
        }
    }
    static getScenario(name) {
        return scenarios[name];
    }
    static async load(scenarioConfig, data) {
        if (scenarios[scenarioConfig.name]) {
            return;
        }
        var scenario = new ScenarioEngine(scenarioConfig, undefined, data);
        scenario.start();
        scenarios[scenarioConfig.name] = scenario;
    }
    static async unload(name) {
        var scenario = scenarios[name];
        if (!scenario) {
            return;
        }
        scenario.stop();
        delete scenarios[name];
    }
    static async loadAll() {
        const SCENARIOS = await typeorm_1.getRepository(entities_1.Scenario).find({
            where: { active: true },
            relations: ['domain', 'creator', 'updater', 'steps']
        });
        SCENARIOS.forEach(scenario => ScenarioEngine.load(scenario));
    }
    async run() {
        var state = this.getState();
        if (state == types_1.SCENARIO_STATE.STARTED || state == types_1.SCENARIO_STATE.PAUSED || this.steps.length == 0) {
            return;
        }
        this.setState(types_1.SCENARIO_STATE.STARTED);
        var context = this.context;
        try {
            while (this.getState() == types_1.SCENARIO_STATE.STARTED) {
                if (this.nextStep == 0) {
                    this.rounds++;
                    context.logger.info(`Start ${this.rounds} Rounds  #######`);
                }
                var step = this.steps[this.nextStep];
                var { next, state, data } = await this.process(step, context);
                context.data[step.name] = data;
                this.publishState();
                if (state !== undefined) {
                    this.setState(state);
                }
                if (next) {
                    this.nextStep = this.steps.findIndex(step => {
                        return step.name == next;
                    });
                    if (this.nextStep == -1) {
                        throw 'Not Found Next Step';
                    }
                }
                else if (this.nextStep == this.steps.length - 1) {
                    this.setState(types_1.SCENARIO_STATE.STOPPED);
                    return;
                }
                else {
                    this.nextStep = this.nextStep + 1;
                }
                await utils_1.sleep(1);
            }
        }
        catch (ex) {
            this.message = ex.stack ? ex.stack : ex;
            this.setState(types_1.SCENARIO_STATE.HALTED);
        }
    }
    async loadSubscenario(stepName, scenarioConfig) {
        this.context.data[stepName] = {};
        var scenario = new ScenarioEngine(scenarioConfig, Object.assign(Object.assign({}, this.context), { data: this.context.data[stepName], state: types_1.SCENARIO_STATE.READY }));
        await scenario.run();
    }
    publishData(tag, data) {
        shell_1.pubsub.publish('publish-data', {
            publishData: {
                tag,
                data
            }
        });
    }
    publishState(message) {
        var steps = this.steps.length;
        var step = this.nextStep;
        shell_1.pubsub.publish('scenario-state', {
            scenarioState: {
                name: this.name,
                state: status[this.getState()],
                progress: {
                    rounds: this.rounds,
                    rate: Math.round(100 * (step / steps)),
                    steps,
                    step
                },
                message
            }
        });
    }
    getState() {
        return this.context.state;
    }
    setState(state) {
        if (this.context.state == state) {
            return;
        }
        var message = `[state changed] ${status[this.getState()]} => ${status[state]}${this.message ? ' caused by ' + this.message : ''}`;
        this.message = '';
        this.context.logger.info(message);
        this.context.state = state;
        this.publishState(message);
    }
    start() {
        if (this.schedule) {
            if (!this.cronjob) {
                this.cronjob = new cron_1.CronJob(this.schedule, this.run.bind(this), null, true, this.timezone);
            }
        }
        else {
            this.run();
        }
    }
    pause() {
        this.setState(types_1.SCENARIO_STATE.PAUSED);
    }
    stop() {
        if (this.cronjob) {
            this.cronjob.stop();
            delete this.cronjob;
        }
        this.setState(types_1.SCENARIO_STATE.STOPPED);
    }
    dispose() {
        this.stop();
    }
    async process(step, context) {
        step = Object.assign({}, step); // copy step
        try {
            step.params = JSON.parse(step.params);
        }
        catch (ex) {
            this.context.logger.error('params parsing error. params must be a JSON.');
        }
        this.context.logger.info(`Step started. ${JSON.stringify(step)}`);
        var handler = task_registry_1.TaskRegistry.getTaskHandler(step.task);
        if (!handler) {
            throw new Error(`no task handler for ${JSON.stringify(step)}`);
        }
        else {
            var retval = await handler(step, context);
        }
        this.context.logger.info(`Step done.`);
        return retval;
    }
}
exports.ScenarioEngine = ScenarioEngine;
ScenarioEngine.logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
//# sourceMappingURL=scenario-engine.js.map