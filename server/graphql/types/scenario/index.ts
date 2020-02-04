import { Scenario } from './scenario'
import { NewScenario } from './new-scenario'
import { ScenarioPatch } from './scenario-patch'
import { ScenarioList } from './scenario-list'
import { ScenarioInstance } from './scenario-instance'
import { ScenarioInstanceList } from './scenario-instance-list'
import { ScenarioState } from './scenario-state'

export const Mutation = `
  createScenario (
    scenario: NewScenario!
  ): Scenario

  updateScenario (
    name: String!
    patch: ScenarioPatch!
  ): Scenario

  updateMultipleScenario (
    patches: [ScenarioPatch]!
  ): [Scenario]

  deleteScenario (
    name: String!
  ): Boolean

  deleteScenarios (
    ids: [String]!
  ): Boolean

  startScenario (
    instanceName: String
    scenarioName: String!
    variables: Object
  ): Scenario

  stopScenario (
    instanceName: String!
  ): Scenario
`

export const Query = `
  scenarios(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ScenarioList
  scenario(id: String!): Scenario
  scenarioInstances(filter: [Filter], pagination: Pagination, sortings: [Sorting]): ScenarioInstanceList
  scenarioInstance(name: String!): ScenarioInstance
`

export const Subscription = `
  scenarioState(name: String): ScenarioState
`

export const Types = [
  Scenario,
  NewScenario,
  ScenarioPatch,
  ScenarioList,
  ScenarioState,
  ScenarioInstance,
  ScenarioInstanceList
]
