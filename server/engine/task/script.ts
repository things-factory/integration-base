import { TaskRegistry } from '../task-registry'

async function Script(step, context) {
  var {
    params: { script }
  } = step
  var { logger } = context || {}

  var result = new Function(script).apply(context)

  return {
    data: result
  }
}

Script.parameterSpec = [
  {
    type: 'textarea',
    name: 'script',
    label: 'script'
  }
]

Script.connectorFree = true

TaskRegistry.registerTaskHandler('script', Script)
