import net from 'net'
import PromiseSocket from 'promise-socket'

import { Connector } from '../types'
import { Connections } from '../connections'

export class EchoBack implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('echo-back-servers are ready')
  }

  async connect(config) {
    var [host = '0.0.0.0', port = 8124] = config.endpoint.split(':')

    return new Promise((resolve, reject) => {
      var server = net.createServer(socket => {
        socket.on('data', function(data) {
          socket.write(data.toString())
        })

        socket.on('error', function(err) {
          Connections.logger.error(err)
          reject(err)
        })
      })

      server.listen(port, async () => {
        Connections.logger.info(`Echo-back server listening on ${host}:${port}`)

        /* default client connection */
        let socket = new net.Socket()
        socket.on('error', console.error)

        try {
          let promiseSocket = new PromiseSocket(socket)
          await promiseSocket.connect(port, 'localhost')
          promiseSocket['__server__'] = server

          Connections.addConnection(config.name, promiseSocket)

          Connections.logger.info(`echo-back-server connection(${config.name}:${config.endpoint}) is connected`)

          resolve()
        } catch (err) {
          Connections.logger.error(err)
          reject(err)
        }
      })
    })
  }

  async disconnect(name) {
    let socket = Connections.removeConnection(name)
    var server = socket['__server__']

    await socket.destroy()
    server && (await server.close())

    Connections.logger.info(`echo-back-server connection(${name}) is disconnected`)
  }

  get parameterSpec() {
    return []
  }
}

Connections.registerConnector('echo-back-server', new EchoBack())
