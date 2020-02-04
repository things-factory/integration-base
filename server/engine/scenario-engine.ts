import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import { Domain, pubsub } from '@things-factory/shell'
import { sleep } from './utils'

import { TaskRegistry } from './task-registry'
import { Step, Context, SCENARIO_STATE } from './types'

import { getRepository } from 'typeorm'
import { Scenario } from '../entities'
import { CronJob } from 'cron'

const { combine, timestamp, splat, printf } = format

const status = ['READY', 'STARTED', 'PAUSED', 'STOPPED', 'HALTED']

export class ScenarioEngine {
  public static client: Object
  private static scenarioInstances = {}

  public domain: Domain
  public scenarioName: string
  public instanceName: string
  public context: Context

  private steps: Step[]
  private rounds: number = 0
  private message: string
  private nextStep: number = 0
  private schedule: string
  private timezone: string
  private cronjob: CronJob

  private static logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
  })

  public static getScenarioInstance(instanceName): ScenarioEngine {
    return ScenarioEngine.scenarioInstances[instanceName]
  }

  public static getScenarioInstances(): ScenarioEngine[] {
    return Object.values(ScenarioEngine.scenarioInstances)
  }

  public static async load(instanceName, scenarioConfig, context?) {
    if (ScenarioEngine.scenarioInstances[instanceName]) {
      return
    }
    var instance = new ScenarioEngine(instanceName, scenarioConfig, context)
    instance.start()

    ScenarioEngine.scenarioInstances[instanceName] = instance
  }

  public static async unload(instanceName) {
    var instance = ScenarioEngine.scenarioInstances[instanceName]
    if (!instance) {
      return
    }
    instance.stop()

    delete ScenarioEngine.scenarioInstances[instanceName]
  }

  public static async loadAll() {
    const SCENARIOS = await getRepository(Scenario).find({
      where: { active: true },
      relations: ['domain', 'creator', 'updater', 'steps']
    })

    SCENARIOS.forEach(scenario => ScenarioEngine.load(scenario.name, scenario))
  }

  constructor(instanceName, { name: scenarioName, steps, schedule = '', timezone = 'Asia/Seoul', domain }, context?) {
    this.instanceName = instanceName
    this.scenarioName = scenarioName
    this.schedule = schedule
    this.timezone = timezone
    this.steps = steps || []
    this.domain = domain

    this.context = {
      domain,
      logger:
        context.logger ||
        createLogger({
          format: combine(timestamp(), splat(), ScenarioEngine.logFormat),
          transports: [
            new (transports as any).DailyRotateFile({
              filename: `logs/scenario-${instanceName}-%DATE%.log`,
              datePattern: 'YYYY-MM-DD-HH',
              zippedArchive: false,
              maxSize: '20m',
              maxFiles: '14d',
              level: 'info'
            })
          ]
        }),
      publish: context.publish || this.publishData.bind(this),
      load: context.load || this.loadSubscenario.bind(this),
      data: context.data || {},
      variables: context.variables || {},
      client: ScenarioEngine.client,
      state: SCENARIO_STATE.READY
    }
  }

  async run() {
    var state = this.getState()
    if (state == SCENARIO_STATE.STARTED || state == SCENARIO_STATE.PAUSED || this.steps.length == 0) {
      return
    }

    this.setState(SCENARIO_STATE.STARTED)
    var context = this.context

    try {
      while (this.getState() == SCENARIO_STATE.STARTED) {
        if (this.nextStep == 0) {
          this.rounds++
          context.logger.info(`Start ${this.rounds} Rounds  #######`)
        }

        var step = this.steps[this.nextStep]
        var { next, state, data } = await this.process(step, context)

        context.data[step.name] = data

        this.publishState()

        if (next) {
          this.nextStep = this.steps.findIndex(step => {
            return step.name == next
          })
          if (this.nextStep == -1) {
            throw 'Not Found Next Step'
          }
        } else if (this.nextStep == this.steps.length - 1) {
          this.setState(SCENARIO_STATE.STOPPED)
        } else {
          this.nextStep = this.nextStep + 1
        }

        if (state !== undefined) {
          this.setState(state)
        }

        await sleep(1)
      }
    } catch (ex) {
      this.message = ex.stack ? ex.stack : ex
      this.setState(SCENARIO_STATE.HALTED)
    }
  }

  async loadSubscenario(stepName, scenarioConfig) {
    this.context.data[stepName] = {}

    var subScenarioInstance = new ScenarioEngine(`${this.instanceName}$${stepName}`, scenarioConfig, {
      ...this.context,
      data: this.context.data[stepName],
      state: SCENARIO_STATE.READY
    })

    await subScenarioInstance.run()
  }

  publishData(tag, data) {
    pubsub.publish('publish-data', {
      publishData: {
        domain: this.context.domain,
        tag,
        data
      }
    })
  }

  publishState(message?) {
    var steps = this.steps.length
    var step = this.nextStep

    pubsub.publish('scenario-state', {
      scenarioState: {
        domain: this.context.domain,
        name: this.instanceName /* TODO SubScenario 의 publish도 메인프로세스 이름으로 받을 수 있게 하자. */,
        state: status[this.getState()],
        progress: {
          rounds: this.rounds,
          rate: Math.round(100 * (step / steps)),
          steps,
          step
        },
        message
      }
    })
  }

  getState(): SCENARIO_STATE {
    return this.context.state
  }

  setState(state) {
    if (this.context.state == state) {
      return
    }

    var message = `[state changed] ${status[this.getState()]} => ${status[state]}${
      this.message ? ' caused by ' + this.message : ''
    }`

    this.message = ''

    this.context.logger.info(message)
    this.context.state = state

    if (state == SCENARIO_STATE.STOPPED) {
      this.nextStep = 0
    }

    this.publishState(message)
  }

  start() {
    if (this.schedule) {
      if (!this.cronjob) {
        this.cronjob = new CronJob(this.schedule, this.run.bind(this), null, true, this.timezone)
      }
    } else {
      this.run()
    }
  }

  pause() {
    this.setState(SCENARIO_STATE.PAUSED)
  }

  stop() {
    if (this.cronjob) {
      this.cronjob.stop()
      delete this.cronjob
    }

    this.setState(SCENARIO_STATE.STOPPED)
  }

  dispose() {
    this.stop()
  }

  async process(step, context): Promise<{ next: string; state: SCENARIO_STATE; data: object }> {
    this.context.logger.info(`Step '${step.name}'(${step.id}) started.`)

    step = {
      ...step
    } // copy step

    try {
      step.params = JSON.parse(step.params)
    } catch (ex) {
      this.context.logger.error(`params(${step.params}) parsing error. params must be a JSON.`)
    }

    var handler = TaskRegistry.getTaskHandler(step.task)
    if (!handler) {
      throw new Error(`no task handler for step '${step.name}'(${step.id})`)
    } else {
      var retval: any = await handler(step, context)
    }

    this.context.logger.info(`Step done.`)
    return retval
  }
}
