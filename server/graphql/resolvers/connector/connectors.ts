import { Connections } from '../../../engine/connections'

export const connectorsResolver = {
  connectors(_: any, {}, context: any) {
    var connectors = Connections.getConnectors()
    var items = Object.keys(connectors)
      .map(name => {
        var connector = connectors[name]
        return {
          name,
          description: '',
          parameterSpec: connector.parameterSpec,
          taskPrefixes: connector.taskPrefixes || []
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
