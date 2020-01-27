import { TaskRegistry } from '../task-registry'

async function Script(step, { logger, data }) {
  var {
    params: { script }
  } = step

  var func = new Function('data', script)
  var result = func(data)
  logger.info(`script done: ${result}`)

  return {
    data: result
  }
}

Script.parameterSpec = [
  {
    type: 'javascript',
    name: 'script',
    label: 'script'
  }
]

TaskRegistry.registerTaskHandler('script', Script)
