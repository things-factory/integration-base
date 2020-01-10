import { TaskRegistry } from '../task-registry'

async function Publish(step, { logger, publish, data }) {
  var {
    params: { tag, accessor }
  } = step

  publish(tag, data[accessor])

  return { data }
}

Publish.parameterSpec = [
  {
    type: 'string',
    name: 'tag',
    label: 'tag'
  },
  {
    type: 'string',
    name: 'accessor',
    label: 'accessor'
  }
]

TaskRegistry.registerTaskHandler('publish', Publish)
