import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import gql from 'graphql-tag'

async function GraphqlMutate(step, { logger, data }) {
  var { connection: connectionName, params: stepOptions } = step
  var { mutation } = stepOptions || {}

  var vos = (mutation.match(/\${[^}]*}/gi) || []).map((key:any) => {
    if (data) {
      key = key.replace('$', '').replace('{', '').replace('}', '');
      let value = eval(`data.${key}`)  // ex: ${stepName.object.key}
      let vo = { key, value }
      return vo
    }
  })

  vos.forEach((vo:any) => {
    let keyname = vo['key']
    mutation = mutation.replace(new RegExp(`\\$\{${keyname}\}`, 'gi'), vo['value'])
  })

  var client = Connections.getConnection(connectionName)

  var response = await client.mutate({
    mutation: gql`
      ${mutation}
    `
  })

  var newData = response.data

  logger.info(`graphql-mutate : \n${JSON.stringify(newData, null, 2)}`)

  return {
    data: newData
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
