import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
// import { schema } from '@things-factory/shell/dist-server/schema'
import gql from 'graphql-tag'

async function LocalGraphqlMutate(step, context) {
  var { connection: connectionName, params: stepOptions } = step
  var { mutation } = stepOptions || {}
  var { logger, client, domain } = context

  mutation = new Function(`return \`${mutation}\`;`).apply(context)

  var response = await client.mutate({
    mutation: gql`
      ${mutation}
    `,
    context: {
      state: {
        domain
      }
    }
  })

  var data = response.data

  logger.info(`local-graphql-mutate : \n${JSON.stringify(data, null, 2)}`)

  return {
    data
  }
}

LocalGraphqlMutate.parameterSpec = [
  {
    type: 'textarea',
    name: 'mutation',
    label: 'mutation'
  }
]

TaskRegistry.registerTaskHandler('local-graphql-mutate', LocalGraphqlMutate)
