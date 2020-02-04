import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
// import { schema } from '@things-factory/shell/dist-server/schema'
import gql from 'graphql-tag'

async function LocalGraphqlQuery(step, context) {
  var { connection: connectionName, params: stepOptions } = step
  var { query } = stepOptions || {}
  var { logger, client, domain } = context

  query = new Function(`return \`${query}\`;`).apply(context)

  var response = await client.query({
    query: gql`
      ${query}
    `,
    context: {
      state: {
        domain
      }
    }
  })

  var data = response.data

  logger.info(`local-graphql-query : \n${JSON.stringify(data, null, 2)}`)

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

TaskRegistry.registerTaskHandler('local-graphql-query', LocalGraphqlQuery)
