import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
// import { schema } from '@things-factory/shell/dist-server/schema'
import gql from 'graphql-tag'

async function LocalGraphqlQuery(step, { logger }) {
  var { connection: connectionName, params: stepOptions } = step
  var { query } = stepOptions || {}

  var client = Connections.getConnection(connectionName)

  var response = await client.query({
    query: gql`
      ${query}
    `
  })

  var data = response.data

  logger.info(`local-graphql-query : \n${JSON.stringify(data, null, 2)}`)

  return {
    data
  }
}

LocalGraphqlQuery.parameterSpec = [
  {
    type: 'graphql',
    name: 'query',
    label: 'query'
  }
]

TaskRegistry.registerTaskHandler('local-graphql-query', LocalGraphqlQuery)
