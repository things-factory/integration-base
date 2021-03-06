import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function EchoReceive(step, { logger }) {
  var { connection: connectionName } = step

  var connection = Connections.getConnection(connectionName)

  var message = await connection.read()

  return {
    data: message.toString()
  }
}

EchoReceive.parameterSpec = []

TaskRegistry.registerTaskHandler('echo-receive', EchoReceive)
