import { Connector } from '../types'
import { Connections } from '../connections'

export class HttpConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('http-connector connections are ready')
  }

  async connect(connection) {
    var { params } = connection

    Connections.addConnection(connection.name, {
      ...connection,
      params
    })
  }

  async disconnect(name) {
    Connections.removeConnection(name)
  }

  get parameterSpec() {
    return [
      {
        type: 'select',
        label: 'authtype',
        name: 'authtype',
        property: {
          options: ['', 'basic']
        }
      },
      {
        type: 'string',
        label: 'username',
        name: 'username'
      },
      {
        type: 'password',
        label: 'password',
        name: 'password'
      }
    ]
  }
}

Connections.registerConnector('http-connector', new HttpConnector())
