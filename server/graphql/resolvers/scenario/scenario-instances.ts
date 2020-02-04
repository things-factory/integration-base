import { ScenarioEngine } from '../../../engine/scenario-engine'

export const scenarioInstancesResolver = {
  scenarioInstances(_: any, {}, context: any) {
    var scenarioInstances = ScenarioEngine.getScenarioInstances()
    var items = Object.keys(scenarioInstances).map(name => {
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
    })

    return {
      items,
      total: items.length
    }
  }
}
