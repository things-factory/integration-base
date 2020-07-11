import { access } from '@things-factory/utils'
import { TaskRegistry } from '../task-registry'

async function Switch(step, { logger, data }) {
  var {
    params: { accessor, cases }
  } = step

  var value = access(accessor, data)

  var next = cases[value] || cases['default']

  logger.info(`switch to next '${next}' by value '${value}' .`)

  return {
    next
  }
}

Switch.parameterSpec = [
  {
    type: 'string',
    name: 'accessor',
    label: 'accessor'
  },
  {
    type: 'map',
    name: 'cases',
    label: 'cases'
  }
]

Switch.connectorFree = true

TaskRegistry.registerTaskHandler('switch', Switch)
