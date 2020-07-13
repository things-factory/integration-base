import { TaskRegistry } from '../task-registry'
// import { schema } from '@things-factory/shell/dist-server/schema'
import gql from 'graphql-tag'

async function LocalGraphqlQuery(step, context) {
  var { connection, params } = step
  var { query } = params || {}
  var { logger, client, domain } = context

  query = new Function(`return \`${query}\`;`).apply(context)

  var { data } = await client.query({
    query: gql`
      ${query}
    `,
    context: {
      state: {
        domain
      }
    }
  })

  return {
    data
  }
}

LocalGraphqlQuery.parameterSpec = [
  {
    type: 'textarea',
    name: 'query',
    label: 'query'
  }
]

LocalGraphqlQuery.connectorFree = true

TaskRegistry.registerTaskHandler('local-graphql-query', LocalGraphqlQuery)
