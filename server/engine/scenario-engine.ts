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

  public static async load(scenarioConfig, context?) {
    if (scenarios[scenarioConfig.name]) {
      return
    }
    var scenario = new ScenarioEngine(scenarioConfig, context)
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

  constructor({ name, steps, schedule = '', timezone = 'Asia/Seoul' }, context) {
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
        var retval = await this.process(step, context)
        context.data[step.name] = retval

        this.publish()

        var { next, state } = this.context

        if (next) {
          this.lastStep = this.steps.findIndex(step => {
            return step.name == next
          })
          delete this.context.next
        } else {
        }
        /*
         * 마지막 스텝에서는 두가지 방향으로 진행된다.
         * schedule이 설정되어 있다면, 다음 스케쥴에서 다시 시작할 수 있도록 상태는 STOP이 된다.
         * schedule이 설정되어 있지 않다면, 무한 반복으로 진행된다.
         * FIXME 이 로직은 schedule에 무한 반복을 정의할 수 있도록 개선되어야 한다.
         */
        if (this.lastStep == this.steps.length - 1 && this.schedule) {
          this.setState(STATE.STOPPED)
        } else {
          await sleep(1)
        }
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

  publish(message?) {
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

    this.publish(message)
  }

  start() {
    /*
     * schedule이 설정되어 있다면, 스케쥴당 scenario가 1회 수행된다.
     * schedule이 설정되어 있지 않다면, scenario는 무한 반복으로 수행된다.
     * FIXME 이 로직은 schedule에 무한 반복을 정의할 수 있도록 개선되어야 한다.
     */
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

  async process(step, context) {
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
      var retval = await handler(step, context)
    }

    this.context.logger.info(`Step done.`)
    return retval
  }
}
