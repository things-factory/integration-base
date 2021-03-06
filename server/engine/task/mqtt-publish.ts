import { access } from '@things-factory/utils'
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

  if (!topic || !accessor) {
    throw Error(`topic and accessor should be defined: : topic - '${topic}', accessor - '${accessor}'`)
  }

  var message = JSON.stringify(access(accessor, data))
  await client.publish(topic, message)

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
