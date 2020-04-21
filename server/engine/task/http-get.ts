import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import { GET_AUTH_HEADERS } from './http-auth'
import fetch from 'node-fetch'
import { URL } from 'url'

async function HttpGet(step, { logger, data }) {
  var { connection: connectionName, params: stepOptions } = step
  var { headers: requestHeaders, searchParams = {}, path } = stepOptions || {}
  var connection = Connections.getConnection(connectionName)

  if (!connection) {
    throw new Error(`connection '${connectionName}' is not established.`)
  }

  var { endpoint, params: connectionParams } = connection

  var url = new URL(path, endpoint)
  Object.keys(searchParams).forEach(key => {
    let value = searchParams[key]
    // TODO value를 accessor로 해석가능하도록 하고, 그 결과를 value로 한다.
    url.searchParams.append(key, value)
  })

  var headers = GET_AUTH_HEADERS(connectionParams) || {}
  Object.keys(requestHeaders).forEach(key => (headers[key] = requestHeaders[key]))

  var response = await fetch(url, {
    method: 'GET',
    headers
  })

  var responseData = await response.text()

  const responseContentType = response.headers.get('content-type')
  if (responseContentType && responseContentType.indexOf('application/json') !== -1) {
    responseData = JSON.stringify(responseData)
  }

  logger.info(`http-get : \n${JSON.stringify(responseData, null, 2)}`)

  return {
    data: responseData
  }
}

HttpGet.parameterSpec = [
  {
    type: 'string',
    name: 'path',
    label: 'path'
  },
  {
    type: 'http-headers',
    name: 'headers',
    label: 'headers'
  },
  {
    type: 'http-parameters',
    name: 'searchParams',
    label: 'search-params'
  }
]

TaskRegistry.registerTaskHandler('http-get', HttpGet)
