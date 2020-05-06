import { Connections } from '../connections'
import { TaskRegistry } from '../task-registry'

async function DatabaseQuery(step, context) {
  var { logger, data } = context
  var {
    connection: connectionName,
    params: { query }
  } = step

  var dbconnection = Connections.getConnection(connectionName)

  query = new Function(`return \`${query}\`;`).apply(context)
  var data = await dbconnection.query(query, [])

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
