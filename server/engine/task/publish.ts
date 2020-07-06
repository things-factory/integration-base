import { access } from '@things-factory/utils'
import { TaskRegistry } from '../task-registry'

async function Publish(step, { logger, publish, data }) {
  var {
    params: { tag, accessor }
  } = step

  if (!tag || !accessor) {
    throw Error(`tag and accessor should be defined: tag - '${tag}', accessor - '${accessor}'`)
  }

  var value = access(accessor, data)

  publish(tag, value)

  return {
    data: value
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

Publish.connectorFree = true

TaskRegistry.registerTaskHandler('publish', Publish)
