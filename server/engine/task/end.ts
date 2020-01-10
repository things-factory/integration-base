import { TaskRegistry } from '../task-registry'
import { SCENARIO_STATE } from '../types'

async function End(step, { logger }) {
  return {
    state: SCENARIO_STATE.STOPPED
  }
}

End.parameterSpec = []

TaskRegistry.registerTaskHandler('end', End)
