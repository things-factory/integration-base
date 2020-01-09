import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import { pubsub } from '@things-factory/shell'
import { sleep } from './utils'

import { TaskRegistry } from './task-registry'
import { Step, SCENARIO_STATE as STATE } from './types'

import { getRepository } from 'typeorm'
import { Scenario } from '../entities'
import { CronJob } from 'cron'

const scenarios = {}

const { combine, timestamp, splat, printf } = format

const status = ['READY', 'STARTED', 'PAUSED', 'STOPPED', 'HALTED']

export class ScenarioEngine {
  private name: string
  private steps: Step[]
  private rounds: number = 0
  private message: string
  private lastStep: number = -1
  private context: { logger: any; publish: Function; data: Object; state: STATE; next: string }
  private schedule: string
  private timezone: string
  private cronjob: CronJob

  private static logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
  })

  public static getScenario(name) {
    return scenarios[name]
  }

  public static async load(scenarioConfig) {
    if (scenarios[scenarioConfig.name]) {
      return
    }
    var scenario = new ScenarioEngine(scenarioConfig)
    scenario.start()

    scenarios[scenarioConfig.name] = scenario
  }

  public static async unload(name) {
    var scenario = scenarios[name]
    if (!scenario) {
      return
    }
    scenario.stop()

    delete scenarios[name]
  }

  public static async loadAll() {
    const SCENARIOS = await getRepository(Scenario).find({
      where: { active: true },
      relations: ['domain', 'creator', 'updater', 'steps']
    })

    SCENARIOS.forEach(scenario => ScenarioEngine.load(scenario))
  }

  constructor({ name, steps, schedule = '', timezone = 'Asia/Seoul' }, context?) {
    this.name = name
    this.schedule = schedule
    this.timezone = timezone
    this.steps = steps || []

    this.context = context || {
      logger: createLogger({
        format: combine(timestamp(), splat(), ScenarioEngine.logFormat),
        transports: [
          new (transports as any).DailyRotateFile({
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
      state: STATE.READY
    }
  }

  async run() {
    var state = this.getState()
    if (state == STATE.STARTED || state == STATE.PAUSED || this.steps.length == 0) {
      return
    }

    this.setState(STATE.STARTED)
    var context = this.context

    try {
      while (this.getState() == STATE.STARTED) {
        this.lastStep = (this.lastStep + 1) % this.steps.length

        if (this.lastStep == 0) {
          context.data = {} /* reset context data */
          this.rounds++
          context.logger.info(`Start ${this.rounds} Rounds  #######`)
        }

        var step = this.steps[this.lastStep]
        var { next, state, data } = await this.process(step, context)

        context.data[step.name] = data

        this.publishState()

        if (state !== undefined) {
          this.setState(state)
        }

        if (next) {
          this.lastStep = this.steps.findIndex(step => {
            return step.name == next
          })
          if (this.lastStep == -1) {
            throw 'Not Found Next Step'
          }
        } else if (this.lastStep == this.steps.length - 1) {
          this.setState(STATE.STOPPED)
          return
        }

        await sleep(1)
      }
    } catch (ex) {
      this.message = ex.stack ? ex.stack : ex
      this.setState(STATE.HALTED)
    }
  }

  async loadSubscenario(scenarioConfig) {
    var scenario = new ScenarioEngine(scenarioConfig, {
      ...this.context,
      state: STATE.READY
    })

    await scenario.run()
  }

  publishData(tag, data) {
    pubsub.publish('publish-data', {
      publishData: {
        tag,
        data
      }
    })
  }

  publishState(message?) {
    var steps = this.steps.length
    var step = this.lastStep + 1

    pubsub.publish('scenario-state', {
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
    })
  }

  getState(): STATE {
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
    this.setState(STATE.PAUSED)
  }

  stop() {
    if (this.cronjob) {
      this.cronjob.stop()
      delete this.cronjob
    }

    this.setState(STATE.STOPPED)
  }

  dispose() {
    this.stop()
  }

  async process(step, context): Promise<{ next: string; state: STATE; data: object }> {
    step = {
      ...step
    } // copy step

    try {
      step.params = JSON.parse(step.params)
    } catch (ex) {
      this.context.logger.error('params parsing error. params must be a JSON.')
    }

    this.context.logger.info(`Step started. ${JSON.stringify(step)}`)

    var handler = TaskRegistry.getTaskHandler(step.task)
    if (!handler) {
      throw new Error(`no task handler for ${JSON.stringify(step)}`)
    } else {
      var retval: any = await handler(step, context)
    }

    this.context.logger.info(`Step done.`)
    return retval
  }
}
