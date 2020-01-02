import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function EchoSend(step, { logger }) {
  var {
    connection: connectionName,
    params: { message }
  } = step

  var connection = Connections.getConnection(connectionName)
  if (!connection) {
    throw Error(`connection is not found : ${connectionName}`)
  }

  var retval = await connection.write(message)

  logger.info(`echo-send : '${message}'`)

  return retval
}

EchoSend.parameterSpec = [
  {
    type: 'string',
    name: 'message',
    label: 'message'
  }
]

TaskRegistry.registerTaskHandler('echo-send', EchoSend)
