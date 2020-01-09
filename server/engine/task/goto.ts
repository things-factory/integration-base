import { TaskRegistry } from '../task-registry'

async function Goto(step, { logger }) {
  var {
    params: { goto }
  } = step

  return {
    next: goto
  }
}

Goto.parameterSpec = [
  {
    type: 'string',
    name: 'goto',
    label: 'goto'
  }
]

TaskRegistry.registerTaskHandler('goto', Goto)
