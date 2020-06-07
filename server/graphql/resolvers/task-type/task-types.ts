import { getRepository } from 'typeorm'
import { Connection } from '../../../entities'
import { Connections } from '../../../engine/connections'
import { TaskRegistry } from '../../../engine/task-registry'

export const taskTypesResolver = {
  taskTypes(_: any, {}, context: any) {
    var taskTypes = TaskRegistry.getTaskHandlers()
    var items = Object.keys(taskTypes)
      .map(name => {
        return {
          name,
          description: '',
          parameterSpec: (taskTypes[name] as any).parameterSpec,
          connectorFree: !!(taskTypes[name] as any).connectorFree
        }
      })
      .sort((x, y) => {
        return x.name < y.name ? -1 : 1
      })

    return {
      items,
      total: items.length
    }
  },

  async taskTypesByConnection(_: any, { connectionName }, context: any) {
    var taskPrefixes = []

    if (connectionName) {
      var connection = await getRepository(Connection).findOne({
        where: { domain: context.state.domain, name: connectionName }
      })

      if (connection) {
        var connector = Connections.getConnector(connection.type)
        taskPrefixes = connector.taskPrefixes || []
      }
    }

    var taskTypes = TaskRegistry.getTaskHandlers()
    var names: string[] = Object.keys(taskTypes)

    if (taskPrefixes.length == 0) {
      names = names.filter(name => !!(taskTypes[name] as any).connectorFree)
    } else {
      names = names.filter(name => taskPrefixes.find(prefix => name.indexOf(prefix) == 0))
    }

    var items: any[] = names
      .map(name => {
        var taskType: any = taskTypes[name]
        return {
          name,
          description: '',
          parameterSpec: taskType.parameterSpec,
          connectorFree: !!taskType.connectorFree
        }
      })
      .sort((x, y) => {
        return x.name < y.name ? -1 : 1
      })

    return {
      items,
      total: items.length
    }
  }
}
