import { Scenario } from './scenario'
import { NewScenario } from './new-scenario'
import { ScenarioPatch } from './scenario-patch'
import { ScenarioList } from './scenario-list'
import { ScenarioInstance } from './scenario-instance'
import { ScenarioInstanceList } from './scenario-instance-list'

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

  copyScenarios (
    ids: [String]!
  ): [Scenario]

  startScenario (
    instanceName: String
    scenarioName: String!
    variables: Object
  ): ScenarioInstance

  stopScenario (
    instanceName: String!
  ): ScenarioInstance

  pauseScenario (
    instanceName: String!
  ): ScenarioInstance

  resumeScenario (
    instanceName: String!
  ): ScenarioInstance

  runScenario (
    instanceName: String
    scenarioName: String!
    variables: Object
  ): ScenarioInstance
`

export const Query = `
  scenarios(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ScenarioList
  scenario(id: String!): Scenario
  scenarioInstances(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ScenarioInstanceList
  scenarioInstance(instanceName: String!): ScenarioInstance
`

export const Subscription = `
  scenarioInstanceState(instanceName: String, scenarioName: String): ScenarioInstance
`

export const Types = [Scenario, NewScenario, ScenarioPatch, ScenarioList, ScenarioInstance, ScenarioInstanceList]
