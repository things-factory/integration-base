import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function MqttSubscribe(step, { logger }) {
  const {
    connection: connectionName,
    params: { topic },
  } = step

  const client = Connections.getConnection(connectionName)

  await client.subscribe(topic)

  // logger.info(`mqtt-subscribe :\n'${message.toString()}'`)

  return {
    // data: message
  }
}

MqttSubscribe.parameterSpec = [
  {
    type: 'string',
    name: 'topic',
    label: 'topic',
  },
]

TaskRegistry.registerTaskHandler('mqtt-subscribe', MqttSubscribe)
