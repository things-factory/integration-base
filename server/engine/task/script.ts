import { TaskRegistry } from '../task-registry'

async function Script(step, context) {
  var {
    params: { script }
  } = step
  var { logger } = context || {}

  var result = new Function(script).apply(context)
  logger.info(`script done: ${result}`)

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

TaskRegistry.registerTaskHandler('script', Script)
