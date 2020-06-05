import { Connector } from '../types'
import { Connections } from '../connections'
import { promisify } from 'util'

const sqlite3 = require('sqlite3').verbose()

export class SqliteConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('sqlite-connector connections are ready')
  }

  async connect(connection) {
    var { endpoint } = connection

    var database = new sqlite3.Database(endpoint, sqlite3.OPEN_READWRITE, err => {
      if (err) {
        Connections.logger.error(err.message)
      }

      Connections.addConnection(connection.name, {
        query: promisify(database.all.bind(database)),
        close: promisify(database.close.bind(database))
      })

      Connections.logger.info(`SQLite Database(${connection.name}) at ${endpoint} connected.`)
    })
  }

  async disconnect(name) {
    var database = Connections.getConnection(name)
    try {
      await database.close()
      Connections.logger.info(`SQLite Database(${name}) closed.`)
    } catch (e) {
      Connections.logger.error(e)
    }

    Connections.removeConnection(name)
  }

  get parameterSpec() {
    return []
  }

  get taskPrefixes() {
    return ['database']
  }
}

Connections.registerConnector('sqlite-connector', new SqliteConnector())
