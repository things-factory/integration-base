import net from 'net'
import PromiseSocket from 'promise-socket'

import { Connector } from '../types'
import { Connections } from '../connections'

export class EchoBack implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect.bind(this)))

    Connections.logger.info('echo-back connections are ready')
  }

  async connect(connection) {
    let socket = new PromiseSocket(new net.Socket())
    let [host, port = 8124] = connection.endpoint.split(':')

    try {
      await socket.connect(port, host)
      Connections.addConnection(connection.name, socket)

      Connections.logger.info(`echo-back-connector connection(${connection.name}:${connection.endpoint}) is connected`)
    } catch (e) {
      Connections.logger.error(
        `echo-back-connector connection(${connection.name}:${connection.endpoint}) is not connected.\ncause: ${e}`
      )
    }
  }

  async disconnect(name) {
    let socket = Connections.removeConnection(name)

    await socket.destroy()

    Connections.logger.info(`echo-back-connector connection(${name}) is disconnected`)
  }

  get parameterSpec() {
    return []
  }

  get taskPrefixes() {
    return ['echo']
  }
}

Connections.registerConnector('echo-back', new EchoBack())
