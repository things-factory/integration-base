import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import { GET_AUTH_HEADERS } from './http-auth'
import fetch from 'node-fetch'
import { URL } from 'url'

async function HttpPost(step, { logger, data }) {
  var { connection: connectionName, params: stepOptions } = step
  var { headers: requestHeaders, contentType, path, accessor } = stepOptions || {}

  var connection = Connections.getConnection(connectionName)

  if (!connection) {
    throw new Error(`connection '${connectionName}' is not established.`)
  }

  var { endpoint, params: connectionParams } = connection

  var url = new URL(path, endpoint)

  var headers = GET_AUTH_HEADERS(connectionParams) || {}
  Object.keys(requestHeaders).forEach(key => (headers[key] = requestHeaders[key]))

  var body = accessor ? data[accessor] : undefined
  if (contentType && body) {
    headers['content-type'] = contentType
    switch (contentType) {
      case 'text/plain':
        body = String(body)
        break
      case 'application/json':
        body = JSON.stringify(body)
        break
      case 'application/x-www-form-urlencoded':
        const searchParams = new URLSearchParams()
        for (const prop in body) {
          searchParams.set(prop, body[prop])
        }
        body = searchParams
        break
    }
  }

  var response = await fetch(url, {
    method: 'POST',
    headers,
    body
  })

  var responseData = await response.text()

  const responseContentType = response.headers.get('content-type')
  if (responseContentType && responseContentType.indexOf('application/json') !== -1) {
    responseData = JSON.stringify(responseData)
  }

  logger.info(`http-post : \n${JSON.stringify(responseData, null, 2)}`)

  return {
    data: responseData
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
    type: 'select',
    name: 'contentType',
    label: 'content-type',
    property: {
      options: [
        {
          display: '',
          value: ''
        },
        {
          display: 'application/json',
          value: 'application/json'
        },
        {
          display: 'text/plain',
          value: 'text/plain'
        },
        {
          display: 'application/x-www-form-urlencoded',
          value: 'application/x-www-form-urlencoded'
        }
      ]
    }
  },
  {
    type: 'string',
    name: 'accessor',
    label: 'accessor'
  }
]

TaskRegistry.registerTaskHandler('http-post', HttpPost)
