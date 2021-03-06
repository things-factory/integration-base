import { TaskType } from './task-type'
import { TaskTypeList } from './task-type-list'

export const Query = `
  taskTypes: TaskTypeList
  taskTypesByConnection(connectionName: String): TaskTypeList
  taskType(name: String!): TaskType
`

export const Types = [TaskType, TaskTypeList]
