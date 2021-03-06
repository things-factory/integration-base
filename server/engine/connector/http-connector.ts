import { Connector } from '../types'
import { Connections } from '../connections'

export class HttpConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect.bind(this)))

    Connections.logger.info('http-connector connections are ready')
  }

  async connect(connection) {
    var { params } = connection

    Connections.addConnection(connection.name, {
      ...connection,
      params
    })

    Connections.logger.info(`http-connector connection(${connection.name}:${connection.endpoint}) is connected`)
  }

  async disconnect(name) {
    Connections.removeConnection(name)

    Connections.logger.info(`http-connector connection(${name}) is disconnected`)
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

  get taskPrefixes() {
    return ['http']
  }
}

Connections.registerConnector('http-connector', new HttpConnector())
