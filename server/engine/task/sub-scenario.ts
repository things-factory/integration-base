import { TaskRegistry } from '../task-registry'

async function SubScenario(step, { logger, publish, data }) {
  var {
    params: { scenario }
  } = step

  /* 
    Sub Scenario에 context-data passing과 return 방법을 고민하자.
  */
  logger.info('sub-scenario doing....')

  return scenario
}

SubScenario.parameterSpec = [
  {
    type: 'entity-selector',
    name: 'scenario',
    label: 'scenario',
    property: {
      queryName: 'scenarios'
    }
  }
]

TaskRegistry.registerTaskHandler('scenario', SubScenario)
