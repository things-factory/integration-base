import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import { sleep } from '@things-factory/utils'

async function MqttSubscribe(step, { logger }) {
  const {
    connection: connectionName,
    params: { topic },
    subscriber
  } = step

  const broker = Connections.getConnection(connectionName)

  /*
   * 1. subscriber list에서 subscriber를 찾는다. 없으면, 생성한다.
   * 2. client.once(...)로 메시지를 취한다.
   */
  if (!subscriber) {
    try {
      step.subscriber = await broker.subscribe(topic)
      logger.info(`success subscribing topic '${topic}'`)

      var TOPIC = null
      var MESSAGE = null

      step.pub = async (topic, message) => {
        TOPIC = topic
        MESSAGE = message

        while (TOPIC) {
          await sleep(100)
        }
      }

      step.sub = async () => {
        while (!TOPIC) {
          await sleep(100)
        }

        var topic = TOPIC
        var message = MESSAGE

        TOPIC = null
        MESSAGE = null

        return {
          topic,
          message
        }
      }

      broker.on('message', async (topic2, message) => {
        if (topic !== topic2) {
          return
        }

        await step.pub(topic2, message)
        logger.info(`mqtt-subscribe :\n'${message.toString()}'`)
      })
    } catch (e) {
      logger.error(e)
    }
  }

  var { message } = await step.sub()

  return {
    data: message
  }
}

MqttSubscribe.parameterSpec = [
  {
    type: 'string',
    name: 'topic',
    label: 'topic'
  }
]

TaskRegistry.registerTaskHandler('mqtt-subscribe', MqttSubscribe)
