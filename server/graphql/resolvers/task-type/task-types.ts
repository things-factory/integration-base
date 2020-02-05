import { TaskRegistry } from '../../../engine/task-registry'

export const taskTypesResolver = {
  taskTypes(_: any, {}, context: any) {
    var taskTypes = TaskRegistry.getTaskHandlers()
    var items = Object.keys(taskTypes)
      .map(name => {
        return {
          name,
          description: '',
          parameterSpec: (taskTypes[name] as any).parameterSpec
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
