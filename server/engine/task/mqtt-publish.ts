import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function MqttPublish(step, { logger }) {
  var {
    connection: connectionName,
    params: { topic, message }
  } = step

  const client = Connections.getConnection(connectionName)
  if (!client) {
    throw Error(`connection is not found : ${connectionName}`)
  }

  await client.publish(topic, message)

  logger.info(`mqtt-publish :\ntopic '${topic}',\nmessage '${message}'`)

  return {
    data: message
  }
}

MqttPublish.parameterSpec = [
  {
    type: 'string',
    name: 'topic',
    label: 'topic'
  },
  {
    type: 'string',
    name: 'message',
    label: 'message'
  }
]

TaskRegistry.registerTaskHandler('mqtt-publish', MqttPublish)
