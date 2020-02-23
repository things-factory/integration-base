import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import { Domain, pubsub } from '@things-factory/shell'
import { sleep } from '@things-factory/utils'

import { TaskRegistry } from './task-registry'
import { Step, Context, SCENARIO_STATE } from './types'

import { getRepository } from 'typeorm'
import { Scenario } from '../entities'
import { CronJob } from 'cron'
import orderBy from 'lodash/orderBy'

const { combine, timestamp, splat, printf } = format

export const ScenarioInstanceStatus = ['READY', 'STARTED', 'PAUSED', 'STOPPED', 'HALTED']

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
    var scenarioInstance = ScenarioEngine.scenarioInstances[instanceName]
    if (scenarioInstance) {
      return scenarioInstance
    }

    var instance = new ScenarioEngine(instanceName, scenarioConfig, context)
    instance.start()

    ScenarioEngine.scenarioInstances[instanceName] = instance

    return instance
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
    this.steps = orderBy(steps || [], step => step.sequence)
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
      state: SCENARIO_STATE.READY,
      root: context.root || this
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
        
        if (!step.skip) {
          // @ts-ignore: Initializer provides no value for this binding element and the binding element has no default value.
          var { next, state, data } = (await this.process(step, context)) || {};
          context.data[step.name] = data
        }

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
      data: this.context.data,
      state: SCENARIO_STATE.READY
    })

    await subScenarioInstance.run()
    
    for (var i = 0; i++; this.steps) {
      let step = this.steps[i]
      if (stepName == step.name) {
        break;
      }
    }

    var step = this.steps[i];
    if (subScenarioInstance.getState() == SCENARIO_STATE.HALTED && step.errorBreakMain) {
      throw new Error(`Sub scenario[${stepName}] error~`)
    }
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
    /* root scenario instance 만 publish state하도록 한다. */
    if (this.context.root === this) {
      pubsub.publish('scenario-instance-state', {
        scenarioInstanceState: {
          domain: this.context.domain,
          scenarioName: this.scenarioName,
          instanceName: this.instanceName,
          state: ScenarioInstanceStatus[this.getState()],
          progress: this.progress,
          data: { ...this.context.data },
          variables: { ...this.context.variables },
          message,
          timestamp: String(Date.now())
        }
      })
    } else {
      ;(this.context.root as ScenarioEngine).publishState(message)
    }
  }

  get progress() {
    var steps = this.steps.length
    var step = this.nextStep

    return {
      rounds: this.rounds,
      rate: Math.round(100 * (step / steps)),
      steps,
      step
    }
  }

  getState(): SCENARIO_STATE {
    return this.context.state
  }

  setState(state) {
    if (this.context.state == state) {
      return
    }

    var message = `[state changed] ${ScenarioInstanceStatus[this.getState()]} => ${ScenarioInstanceStatus[state]}${
      this.message ? ' caused by ' + this.message : ''
    }`

    this.message = ''

    this.context.logger.info(message)
    this.context.state = state

    if (state == SCENARIO_STATE.STOPPED || state == SCENARIO_STATE.HALTED) {
      this.nextStep = 0
      if (!this.cronjob) {
        ScenarioEngine.unload(this.instanceName)
      }
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
    if (this.getState() == SCENARIO_STATE.STARTED) this.setState(SCENARIO_STATE.PAUSED)
  }

  resume() {
    if (this.getState() == SCENARIO_STATE.PAUSED) {
      this.setState(SCENARIO_STATE.READY)
      this.run()
    }
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
