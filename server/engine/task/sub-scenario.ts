import { TaskRegistry } from '../task-registry'
import { Scenario } from '../../entities'
import { getRepository } from 'typeorm'

async function SubScenario(step, context) {
  var { logger, load } = context
  var {
    params: { scenario }
  } = step

  var subscenario = await getRepository(Scenario).findOne({
    where: {
      id: scenario
    },
    relations: ['steps', 'domain']
  })

  logger.info(`Sub Scenario '${subscenario.name}' Started.`)
  var subContext = await load(step, subscenario, context)
  logger.info(`Sub Scenario '${subscenario.name}' done.`)

  return {
    data: subContext.data
  }
}

SubScenario.parameterSpec = [
  {
    type: 'entity-selector',
    name: 'scenario',
    label: 'scenario',
    property: {
      queryName: 'scenarios'
    }
  },
  {
    type: 'checkbox',
    name: 'errorPropagation',
    label: 'error-propagation'
  }
]

SubScenario.connectorFree = true

TaskRegistry.registerTaskHandler('scenario', SubScenario)
