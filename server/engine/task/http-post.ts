import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import { GET_AUTH_HEADERS } from './http-auth'
import fetch from 'node-fetch'
import { URL } from 'url'

async function HttpPost(step, { logger, data }) {
  var { connection: connectionName, params: stepOptions } = step
  var { headers, params = {}, body: bodyOptions, path } = stepOptions || {}
  var { kind = 'none', accessor } = bodyOptions || {}

  var connection = Connections.getConnection(connectionName)

  if (!connection) {
    throw new Error(`connection '${connectionName}' is not established.`)
  }

  var { endpoint, params: connectionParams } = connection

  var url = new URL(path, endpoint)
  // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  var body
  var bodyData
  if (accessor) {
    bodyData = data[accessor]
  }

  switch (kind) {
    case 'raw':
    case 'x-www-form-urlencoded':
    case 'form-data':
      body = JSON.stringify(bodyData)
      break
    case 'none':
    default:
  }

  var response = await fetch(url, {
    method: 'POST',
    headers: {
      ...(GET_AUTH_HEADERS(connectionParams) || {})
      // ...headers
    },
    body
  })

  // TODO follow the format
  // plain-text
  var data = await response.json()
  // var data = await response.text()

  logger.info(`http-get : \n${JSON.stringify(data, null, 2)}`)

  return {
    data
  }
}

HttpPost.parameterSpec = [
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
    name: 'params',
    label: 'params'
  },
  {
    type: 'http-body',
    name: 'body',
    label: 'body'
  }
]

TaskRegistry.registerTaskHandler('http-post', HttpPost)
