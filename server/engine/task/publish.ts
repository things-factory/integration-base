import { TaskRegistry } from '../task-registry'

async function Publish(step, { logger, publish, data }) {
  var {
    params: { tag, accessor }
  } = step

  if (!tag || !accessor) {
    throw Error(`tag and accessor should be defined: tag - '${tag}', accessor - '${accessor}'`)
  }

  publish(tag, data[accessor])

  return {
    data: data[accessor]
  }
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
