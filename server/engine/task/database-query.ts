import { Connections } from '../connections'
import { TaskRegistry } from '../task-registry'

async function DatabaseQuery(step, { logger, data }) {
  var {
    connection: connectionName,
    params: { query }
  } = step

  var database = Connections.getConnection(connectionName)

  var data = await database.query(query, [])

  logger.info(JSON.stringify(data, null, 2))

  return {
    data
  }
}

DatabaseQuery.parameterSpec = [
  {
    type: 'textarea',
    name: 'query',
    label: 'query'
  }
]

TaskRegistry.registerTaskHandler('database-query', DatabaseQuery)
