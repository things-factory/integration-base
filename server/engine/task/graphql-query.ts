import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import gql from 'graphql-tag'

async function GraphqlQuery(step, context) {
  var { connection: connectionName, params: stepOptions } = step
  var { query } = stepOptions || {}

  query = new Function(`return \`${query}\`;`).apply(context)

  var client = Connections.getConnection(connectionName)

  var { data } = await client.query({
    query: gql`
      ${query}
    `
  })

  return {
    data
  }
}

GraphqlQuery.parameterSpec = [
  {
    type: 'textarea',
    name: 'query',
    label: 'query'
  }
]

TaskRegistry.registerTaskHandler('graphql-query', GraphqlQuery)
