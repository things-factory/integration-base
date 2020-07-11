import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
// import { schema } from '@things-factory/shell/dist-server/schema'
import gql from 'graphql-tag'

async function LocalGraphqlMutate(step, context) {
  var { connection, params } = step
  var { mutation } = params || {}
  var { logger, client, domain } = context

  mutation = new Function(`return \`${mutation}\`;`).apply(context)

  var { data } = await client.mutate({
    mutation: gql`
      ${mutation}
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

LocalGraphqlMutate.parameterSpec = [
  {
    type: 'textarea',
    name: 'mutation',
    label: 'mutation'
  }
]

TaskRegistry.registerTaskHandler('local-graphql-mutate', LocalGraphqlMutate)
