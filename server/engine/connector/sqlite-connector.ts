import { logger } from '@things-factory/env'
import { Connector } from '../types'
import { Connections } from '../connections'

const util = require('util')
const sqlite3 = require('sqlite3').verbose()

export class SqliteConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    logger.info('sqlite-connector connections are ready')
  }

  async connect(connection) {
    var { endpoint } = connection

    var database = new sqlite3.Database(endpoint, sqlite3.OPEN_READWRITE, err => {
      if (err) {
        logger.error(err.message)
      }
      logger.info('The database connected.')

      Connections.addConnection(connection.name, {
        query: util.promisify(database.all.bind(database)),
        close: util.promisify(database.close.bind(database))
      })
    })
  }

  async disconnect(name) {
    var database = Connections.getConnection(name)
    try {
      await database.close()
      logger.log('The database connection closed.')
    } catch (e) {
      logger.error(e)
    }

    Connections.removeConnection(name)
  }

  get parameterSpec() {
    return []
  }
}

Connections.registerConnector('sqlite-connector', new SqliteConnector())
