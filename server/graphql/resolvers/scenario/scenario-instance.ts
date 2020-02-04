import { ScenarioEngine } from '../../../engine/scenario-engine'

export const scenarioInstanceResolver = {
  scenarioInstance(_: any, { name }, context: any) {
    var { domain, instanceName, scenarioName, context } = ScenarioEngine.getScenarioInstance(name)
    var { variables, data, state } = context || {}

    return {
      domain,
      instanceName,
      scenarioName,
      variables,
      data,
      state
    }
  }
}
