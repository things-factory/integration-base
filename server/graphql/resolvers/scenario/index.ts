import { scenarioResolver } from './scenario'
import { scenariosResolver } from './scenarios'

import { updateScenario } from './update-scenario'
import { updateMultipleScenario } from './update-multiple-scenario'
import { createScenario } from './create-scenario'
import { deleteScenario } from './delete-scenario'
import { deleteScenarios } from './delete-scenarios'
import { copyScenarios } from './copy-scenarios'

import { startScenario } from './start-scenario'
import { stopScenario } from './stop-scenario'
import { pauseScenario } from './pause-scenario'
import { resumeScenario } from './resume-scenario'
import { callScenario } from './call-scenario'

import { scenarioInstanceResolver } from './scenario-instance'
import { scenarioInstancesResolver } from './scenario-instances'

import { scenarioInstanceState } from './scenario-instance-state'

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
  ...copyScenarios,
  ...startScenario,
  ...stopScenario,
  ...pauseScenario,
  ...resumeScenario,
  ...callScenario
}

export const Subscription = {
  ...scenarioInstanceState
}
