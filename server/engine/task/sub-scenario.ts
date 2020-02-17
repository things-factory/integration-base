import { TaskRegistry } from '../task-registry'
import { Scenario } from '../../entities'
import { getRepository } from 'typeorm'

async function SubScenario(step, { logger, load, data }) {
  var {
    ifSkip,
    name,
    params: { scenario }
  } = step

  if (ifSkip) {
    return {}
  }

  var subscenario = await getRepository(Scenario).findOne({
    where: {
      id: scenario
    },
    relations: ['steps']
  })

  logger.info(`Sub Scenario '${subscenario.name}' Started.`)
  await load(name, subscenario)
  logger.info(`Sub Scenario '${subscenario.name}' done.`)

  return {}
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
