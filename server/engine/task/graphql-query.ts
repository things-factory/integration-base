import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import gql from 'graphql-tag'

async function GraphqlQuery(step, { logger, data }) {
  var { connection: connectionName, params: stepOptions } = step
  var { query } = stepOptions || {}
  var vos = (query.match(/\${[^}]*}/gi) || []).map((key:any) => {
    let value = eval(`data.${key.replace('$', '').replace('{', '').replace('}', '')}`)  // ex: ${stepName.object.value}
    
    let vo = { key, value }
    return vo
  })

  vos.forEach((vo:any) => {
    query = query.replace(/${vo['key']}/g, vo['value'])
  })

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
