import { ScenarioEngine } from '../../../engine/scenario-engine'
import { Context } from '../../../engine/types'

export const scenarioInstanceResolver = {
  scenarioInstance(_: any, { instanceName }, context: any) {
    var { domain, scenarioName, context: Context } = ScenarioEngine.getScenarioInstance(instanceName)
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
