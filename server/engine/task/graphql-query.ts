import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import gql from 'graphql-tag'

async function GraphqlQuery(step, context) {
  var { connection: connectionName, params: stepOptions } = step
  var { query } = stepOptions || {}
  var { logger } = context

  // var vos = (query.match(/\${[^}]*}/gi) || []).map((key: any) => {
  //   if (context) {
  //     key = key
  //       .replace('$', '')
  //       .replace('{', '')
  //       .replace('}', '')
  //     let value = eval(`context.${key}`) // ex: ${stepName.object.key}
  //     let vo = { key, value }
  //     return vo
  //   }
  // })

  // vos.forEach((vo: any) => {
  //   let keyname = vo['key']
  //   query = query.replace(new RegExp(`\\$\{${keyname}\}`, 'gi'), vo['value'])
  // })

  query = new Function(`return \`${query}\`;`).apply(context)
  
  var client = Connections.getConnection(connectionName)

  var response = await client.query({
    query: gql`
      ${query}
    `
  })

  var newData = response.data

  logger.info(`graphql-query : \n${JSON.stringify(newData, null, 2)}`)

  return {
    data: newData
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
