import { logger } from '@things-factory/env'
import { Connector } from '../types'
import { Connections } from '../connections'

const { Client } = require('pg')

export class PostgresqlConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    logger.info('postgresql-connector connections are ready')
  }

  async connect(connection) {
    const {
      endpoint,
      params: { user, password, database }
    } = connection
    const [host, port = 5432] = endpoint.split(':')

    const client = new Client({
      user,
      host,
      database,
      password,
      port: Number(port)
    })

    await client.connect()

    Connections.addConnection(connection.name, {
      query: client.query.bind(client),
      close: client.end.bind(client)
    })

    logger.info('The database connected.')
  }

  async disconnect(name) {
    var client = Connections.getConnection(name)
    try {
      await client.close()
      logger.log('The database connection closed.')
    } catch (e) {
      logger.error(e)
    }

    Connections.removeConnection(name)
  }

  get parameterSpec() {
    return [
      {
        type: 'string',
        name: 'user',
        label: 'user'
      },
      {
        type: 'password',
        name: 'password',
        label: 'password'
      },
      {
        type: 'string',
        name: 'database',
        label: 'database'
      }
    ]
  }
}

Connections.registerConnector('postgresql-connector', new PostgresqlConnector())
