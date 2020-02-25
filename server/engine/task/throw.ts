import { TaskRegistry } from '../task-registry'

async function Throw(step, { logger }) {
  var {
    name,
    params: { message }
  } = step

  throw `'${message}' is thrown by step '${name}'`

  return {}
}

Throw.parameterSpec = [
  {
    type: 'string',
    name: 'message',
    label: 'message'
  }
]

TaskRegistry.registerTaskHandler('throw', Throw)
