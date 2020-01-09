import { TaskRegistry } from '../task-registry'

async function Switch(step, { logger }) {
  var {
    params: { goto }
  } = step

  return {
    next: goto
  }
}

Switch.parameterSpec = [
  {
    type: 'string',
    name: 'goto',
    label: 'goto'
  }
]

TaskRegistry.registerTaskHandler('switch', Switch)
