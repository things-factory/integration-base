import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function MqttPublish(step, { logger, data }) {
  var {
    connection: connectionName,
    params: { topic, accessor }
  } = step

  const { client } = Connections.getConnection(connectionName)
  if (!client) {
    throw Error(`connection is not found : ${connectionName}`)
  }

  if (!accessor) {
    throw Error(`accessor should be defined`)
  }

  var message = JSON.stringify(data[accessor])
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
    name: 'accessor',
    label: 'accessor'
  }
]

TaskRegistry.registerTaskHandler('mqtt-publish', MqttPublish)
