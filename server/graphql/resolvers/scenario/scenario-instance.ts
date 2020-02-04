import { ScenarioEngine, ScenarioStatus } from '../../../engine/scenario-engine'
import { Context } from '../../../engine/types'

export const scenarioInstanceResolver = {
  scenarioInstance(_: any, { instanceName }, context: any) {
    var { domain, scenarioName, context: Context, progress } = ScenarioEngine.getScenarioInstance(instanceName)
    var { variables, data, state } = context || {}

    return {
      domain,
      instanceName,
      scenarioName,
      variables: { ...variables },
      data: { ...data },
      state: ScenarioStatus[state],
      progress,
      timestamp: String(Date.now())
    }
  }
}
