import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
// import { schema } from '@things-factory/shell/dist-server/schema'
import gql from 'graphql-tag'

async function LocalGraphqlMutate(step, { logger }) {
  var { connection: connectionName, params: stepOptions } = step
  var { mutation } = stepOptions || {}

  var client = Connections.getConnection(connectionName)

  var response = await client.mutate({
    mutation: gql`
      ${mutation}
    `
  })

  var data = response.data

  logger.info(`local-graphql-mutate : \n${JSON.stringify(data, null, 2)}`)

  return {
    data
  }
}

LocalGraphqlMutate.parameterSpec = [
  {
    type: 'graphql',
    name: 'mutation',
    label: 'mutation'
  }
]

TaskRegistry.registerTaskHandler('local-graphql-mutate', LocalGraphqlMutate)
