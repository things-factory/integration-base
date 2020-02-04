import { scenarioResolver } from './scenario'
import { scenariosResolver } from './scenarios'

import { updateScenario } from './update-scenario'
import { updateMultipleScenario } from './update-multiple-scenario'
import { createScenario } from './create-scenario'
import { deleteScenario } from './delete-scenario'
import { deleteScenarios } from './delete-scenarios'

import { startScenario } from './start-scenario'
import { stopScenario } from './stop-scenario'

import { scenarioInstanceResolver } from './scenario-instance'
import { scenarioInstancesResolver } from './scenario-instances'

import { scenarioState } from './scenario-state'

export const Query = {
  ...scenariosResolver,
  ...scenarioResolver,
  ...scenarioInstancesResolver,
  ...scenarioInstanceResolver
}

export const Mutation = {
  ...updateScenario,
  ...updateMultipleScenario,
  ...createScenario,
  ...deleteScenario,
  ...deleteScenarios,
  ...startScenario,
  ...stopScenario
}

export const Subscription = {
  ...scenarioState
}
