import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import { pubsub } from '@things-factory/shell'
import { sleep } from './utils'

import { TaskRegistry } from './task-registry'
import { Step } from './types'

import { getRepository } from 'typeorm'
import { Scenario } from '../entities'
import { CronJob } from 'cron'

const scenarios = {}

const { combine, timestamp, splat, printf } = format

enum STATE {
  READY,
  STARTED,
  PAUSED,
  STOPPED,
  HALTED
}

const status = ['READY', 'STARTED', 'PAUSED', 'STOPPED', 'HALTED']

export class ScenarioEngine {
  private name: string
  private steps: Step[]
  private rounds: number = 0
  private _state: STATE
  private message: string
  private lastStep: number = -1
  private logger: any
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

  constructor({ name, steps, schedule = '', timezone = 'Asia/Seoul' }) {
    this.name = name
    this.schedule = schedule
    this.timezone = timezone
    this.steps = steps || []
    this.logger = createLogger({
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
    })

    this.state = STATE.READY
  }

  async run() {
    if (this.state == STATE.STARTED || this.state == STATE.PAUSED || this.steps.length == 0) {
      return
    }

    this.state = STATE.STARTED
    var context = {
      logger: this.logger,
      publish: this.publishData.bind(this),
      data: {}
    }

    try {
      while (this.state == STATE.STARTED) {
        this.lastStep = (this.lastStep + 1) % this.steps.length

        if (this.lastStep == 0) {
          context.data = {} /* reset context data */
          this.rounds++
          this.logger.info(`Start ${this.rounds} Rounds  #######`)
        }

        var step = this.steps[this.lastStep]
        var retval = await this.process(step, context)
        context.data[step.name] = retval

        this.publish()

        /*
         * 마지막 스텝에서는 두가지 방향으로 진행된다.
         * schedule이 설정되어 있다면, 다음 스케쥴에서 다시 시작할 수 있도록 상태는 STOP이 된다.
         * schedule이 설정되어 있지 않다면, 무한 반복으로 진행된다.
         * FIXME 이 로직은 schedule에 무한 반복을 정의할 수 있도록 개선되어야 한다.
         */
        if (this.lastStep == this.steps.length - 1 && this.schedule) {
          this.state = STATE.STOPPED
        } else {
          await sleep(1)
        }
      }
    } catch (ex) {
      this.message = ex.stack ? ex.stack : ex
      this.state = STATE.HALTED
    }
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
        state: status[this.state],
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

  get state() {
    return this._state
  }

  set state(state) {
    if (this._state == state) {
      return
    }

    var message = `[state changed] ${status[this.state]} => ${status[state]}${
      this.message ? ' caused by ' + this.message : ''
    }`

    this.message = ''

    this.logger.info(message)
    this._state = state

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
    this.state = STATE.PAUSED
  }

  stop() {
    if (this.cronjob) {
      this.cronjob.stop()
      delete this.cronjob
    }

    this.state = STATE.STOPPED
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
      this.logger.error('params parsing error. params must be a JSON.')
    }

    this.logger.info(`Step started. ${JSON.stringify(step)}`)

    var handler = TaskRegistry.getTaskHandler(step.task)
    if (!handler) {
      throw new Error(`no task handler for ${JSON.stringify(step)}`)
    } else {
      var retval = await handler(step, context)
    }

    this.logger.info(`Step done.`)
    return retval
  }
}
