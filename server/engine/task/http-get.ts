import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import { GET_AUTH_HEADERS } from './http-auth'
import fetch from 'node-fetch'
import { URL } from 'url'

const SELF = function (o) {
  return o
}
async function HttpGet(step, { logger, data }) {
  var { connection: connectionName, params: stepOptions } = step
  var { headers: requestHeaders, searchParams = {}, path } = stepOptions || {}
  var connection = Connections.getConnection(connectionName)

  if (!connection) {
    throw new Error(`connection '${connectionName}' is not established.`)
  }

  var { endpoint, params: connectionParams } = connection
  var url = new URL(path, endpoint)
  if (searchParams) {
    Object.keys(searchParams).forEach(key => {
      let value = substituteValue(searchParams[key], data)
      url.searchParams.append(key, value)
    })
  }
  var headers = GET_AUTH_HEADERS(connectionParams) || {}
  if (requestHeaders) Object.keys(requestHeaders).forEach(key => (headers[key] = requestHeaders[key]))

  var response = await fetch(url, {
    method: 'GET',
    headers
  })

  var responseData = await response.text()

  const responseContentType = response.headers.get('content-type')
  if (responseContentType && responseContentType.indexOf('application/json') !== -1) {
    responseData = JSON.parse(responseData)
  }

  logger.info(`http-get : \n${JSON.stringify(responseData, null, 2)}`)

  return {
    data: responseData
  }

}
function substituteValue(value, data) {
  var text = String(value)
  var substituteVal = text.match(/#{[^}]*}/gi)
  var prop = substituteVal ? parse(substituteVal[0]) : undefined
  if (prop && data.hasOwnProperty(prop.target)) {
    return prop.accessor(data[prop.target])
  }
  return value
}

function parse(text) {
  var defaultIndex = text.indexOf('||')
  var originText = ''
  var defaultValue = ''
  if (defaultIndex != -1) {
    originText = text
    defaultValue = text.substring(defaultIndex + 2, text.length - 1).trim()
    text = text.replace(text.substring(defaultIndex, text.length - 1), '').trim()
  }
  var parsed = text
    .substr(2, text.length - 3)
    .trim()
    .replace(/\[(\w+)\]/g, '.$1')
    .replace(/^\./, '')
    .split('.')
    .filter(accessor => !!accessor.trim())
  var accessors = parsed.slice(1)
  return {
    defaultValue: defaultValue,
    match: text,
    originText: originText || text,
    target: parsed[0],
    accessor:
      accessors.length > 0
        ? function (o) {
          return accessors.reduce((o, accessor) => (o ? o[accessor] : undefined), o)
        }
        : SELF
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
