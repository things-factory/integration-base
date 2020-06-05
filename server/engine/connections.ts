import { createLogger, format, transports } from 'winston'
import { Connector } from './types'

import { getRepository } from 'typeorm'
import { Connection } from '../entities'

const { combine, timestamp, splat, printf } = format

export class Connections {
  private static connectors: { [propName: string]: Connector } = {}
  private static connections = {}
  private static logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
  })
  public static logger = createLogger({
    format: combine(timestamp(), splat(), Connections.logFormat),
    transports: [
      new (transports as any).DailyRotateFile({
        filename: `logs/connections-%DATE%.log`,
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: false,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'info'
      })
    ]
  })

  static async ready() {
    const CONNECTIONS = (
      await getRepository(Connection).find({
        where: { active: true },
        relations: ['domain', 'creator', 'updater']
      })
    ).map(connection => {
      var params = {}
      try {
        params = JSON.parse(connection.params || '{}')
      } catch (ex) {
        Connections.logger.error(`connection '${connection.name}' params should be JSON format`)
        Connections.logger.error(ex)
      }

      return {
        ...connection,
        params
      }
    })

    Connections.logger.info('Initializing Connections...')

    return Promise.all(
      Object.keys(Connections.connectors).map(type => {
        var connector = Connections.connectors[type]
        Connections.logger.info(`Connector '${type}' started to ready`)

        return connector
          .ready(CONNECTIONS.filter(connection => connection.type == type) as any)
          .catch(error => {
            Connections.logger.error(error.message)
          })
          .then(() => {
            Connections.logger.info(`All connector for '${type}' ready`)
          })
      })
    ).then(() => {
      Connections.logger.info(
        'Connections initialization done: %s',
        JSON.stringify(Object.keys(Connections.getConnections()))
      )
    })
  }

  static registerConnector(type: string, connector: Connector) {
    Connections.connectors[type] = connector
  }

  static getConnector(type: string): Connector {
    return Connections.connectors[type]
  }

  static getConnectors(): { [connectorName: string]: Connector } {
    return {
      ...Connections.connectors
    }
  }

  static unregisterConnector(type: string) {
    delete Connections.connectors[type]
  }

  static getConnection(name: string): any {
    return Connections.connections[name]
  }

  static getConnections(): { [connectionName: string]: any } {
    return {
      ...Connections.connections
    }
  }

  static addConnection(name: string, connection: any) {
    Connections.connections[name] = connection
  }

  static removeConnection(name): any {
    var connection = Connections.connections[name]
    delete Connections.connections[name]
    return connection
  }
}
