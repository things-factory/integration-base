import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import gql from 'graphql-tag'

async function GraphqlMutate(step, context) {
  var { connection: connectionName, params: stepOptions } = step
  var { mutation } = stepOptions || {}

  mutation = new Function(`return \`${mutation}\`;`).apply(context)

  var client = Connections.getConnection(connectionName)

  var response = await client.mutate({
    mutation: gql`
      ${mutation}
    `
  })

  var { data } = response.data

  return {
    data
  }
}

GraphqlMutate.parameterSpec = [
  {
    type: 'textarea',
    name: 'mutation',
    label: 'mutation'
  }
]

TaskRegistry.registerTaskHandler('graphql-mutate', GraphqlMutate)
