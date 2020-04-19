import mqtt from 'async-mqtt'

import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import { sleep } from '@things-factory/utils'

function convertDataFormat(data, format) {
  if (format == 'json') {
    return JSON.parse(data)
  }

  return data
}

async function MqttSubscribe(step, context) {
  const {
    connection: connectionName,
    params: { topic, dataFormat },
    name
  } = step

  const { logger, closures, __mqtt_subscriber } = context
  if (!__mqtt_subscriber) {
    context.__mqtt_subscriber = {}
  }

  const {
    connection: { endpoint: uri }
  } = Connections.getConnection(connectionName)

  if (!topic) {
    throw Error(`topic is not found for ${connectionName}`)
  }

  /*
   * 1. subscriber list에서 subscriber를 찾는다. 없으면, 생성한다.
   * 2. client.once(...)로 메시지를 취한다.
   *
   * TODO 동일 브로커의 다중 subscribe 태스크에 대해서 완벽한 지원을 해야한다.
   * - 현재는 여러 태스크가 동일 topic을 subscribe 하는 경우에 정상동작하지 않을 것이다.
   */
  if (!context.__mqtt_subscriber[name]) {
    try {
      const broker = await mqtt.connectAsync(uri)

      logger.info(`mqtt-connector connection(${connectionName}:${uri}) is connected`)

      await broker.subscribe(topic)
      logger.info(`success subscribing topic '${topic}'`)

      var TOPIC = []
      var MESSAGE = []

      context.__mqtt_subscriber[name] = async () => {
        while (MESSAGE.length == 0) {
          await sleep(100)
        }

        var topic = TOPIC.shift()
        var message = MESSAGE.shift()

        return {
          topic,
          message
        }
      }

      broker.on('message', async (messageTopic, message) => {
        if (topic !== messageTopic) {
          return
        }

        TOPIC.push(topic)
        MESSAGE.push(convertDataFormat(message, dataFormat))

        logger.info(`mqtt-subscribe :\n'${message.toString()}'`)
      })

      closures.push(async () => {
        try {
          broker && (await broker.end())
          logger.info(`mqtt-connector connection(${connectionName}:${uri}) is disconnected`)
        } catch (e) {
          logger.error(e)
        }
      })
    } catch (e) {
      logger.error(e)
    }
  }

  var { message } = await context.__mqtt_subscriber[name]()

  return {
    data: message
  }
}

MqttSubscribe.parameterSpec = [
  {
    type: 'string',
    name: 'topic',
    label: 'topic'
  },
  {
    type: 'select',
    label: 'data-format',
    name: 'dataFormat',
    property: {
      options: [
        {
          display: 'Plain Text',
          value: 'text'
        },
        {
          display: 'JSON',
          value: 'json'
        }
      ]
    }
  }
]

TaskRegistry.registerTaskHandler('mqtt-subscribe', MqttSubscribe)
