import { getRepository } from 'typeorm'
import { Connection } from '../../../entities'
import { Connections } from '../../../engine/connections'

export const connectorResolver = {
  connector(_: any, { name }, context: any) {
    var connector = Connections.getConnector(name)

    return {
      name,
      description: '',
      parameterSpec: connector.parameterSpec,
      taskPrefixes: connector.taskPrefixes || []
    }
  },

  async connectorByConnection(_: any, { connectionName }, context: any) {
    var connection = await getRepository(Connection).findOne({
      where: { domain: context.state.domain, name: connectionName }
    })

    var connector = Connections.getConnector(connection.type)

    return {
      name: connection,
      description: '',
      parameterSpec: connector.parameterSpec,
      taskPrefixes: connector.taskPrefixes || []
    }
  }
}
