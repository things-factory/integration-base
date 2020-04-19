import { Connector } from '../types'
import { Connections } from '../connections'

import mqtt from 'async-mqtt'

export class MqttConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('mqtt-connector connections are ready')
  }

  async connect(connection) {
    const { endpoint: uri } = connection

    try {
      const client = await mqtt.connectAsync(uri)

      Connections.addConnection(connection.name, {
        client,
        connection
      })

      Connections.logger.info(`mqtt-connector connection(${connection.name}:${connection.endpoint}) is connected`)
    } catch (err) {
      Connections.logger.error(`mqtt-connector connection(${connection.name}:${connection.endpoint}) is failed`, err)
    }
  }

  async disconnect(name) {
    const { client } = Connections.removeConnection(name)

    client && (await client.end())
  }

  get parameterSpec() {
    return []
  }
}

Connections.registerConnector('mqtt-connector', new MqttConnector())
