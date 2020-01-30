import { logger } from '@things-factory/env'
import { Connector } from './types'

import { getRepository } from 'typeorm'
import { Connection } from '../entities'

export class Connections {
  private static connectors: { [propName: string]: Connector } = {}
  private static connections = {}

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
        logger.error(`connection '${connection.name}' params should be JSON format`)
        logger.error(ex)
      }

      return {
        ...connection,
        params
      }
    })

    return Promise.all(
      Object.keys(Connections.connectors).map(type => {
        var connector = Connections.connectors[type]

        return connector.ready(CONNECTIONS.filter(connection => connection.type == type) as any).catch(error => {
          logger.error(error.message)
        })
      })
    )
  }

  static registerConnector(type, connector) {
    Connections.connectors[type] = connector
  }

  static getConnector(type) {
    return Connections.connectors[type]
  }

  static getConnectors(): { [propName: string]: Connector } {
    return {
      ...Connections.connectors
    }
  }

  static unregisterConnector(type) {
    delete Connections.connectors[type]
  }

  static getConnection(name) {
    return Connections.connections[name]
  }

  static getConnections() {
    return {
      ...Connections.connections
    }
  }

  static addConnection(name, connection) {
    Connections.connections[name] = connection
  }

  static removeConnection(name) {
    var connection = Connections.connections[name]
    delete Connections.connections[name]
    return connection
  }
}
