import { Connections } from '../../../engine/connections'

export const connectorsResolver = {
  connectors(_: any, {}, context: any) {
    var connectors = Connections.getConnectors()
    var items = Object.keys(connectors)
      .map(name => {
        return {
          name,
          description: '',
          parameterSpec: connectors[name].parameterSpec
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
