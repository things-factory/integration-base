import { Connector } from './connector'
import { ConnectorList } from './connector-list'

export const Query = `
  connectors: ConnectorList
  connector(name: String!): Connector
  connectorByConnection(connectionName: String!): Connector
`

export const Types = [Connector, ConnectorList]
