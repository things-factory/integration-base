import { ScenarioEngine, ScenarioInstanceStatus } from '../../../engine/scenario-engine'

export const scenarioInstanceResolver = {
  scenarioInstance(_: any, { instanceName }, context: any) {
    var { domain, scenarioName, context: instanceContext, progress } = ScenarioEngine.getScenarioInstance(instanceName)
    var { variables, data, state } = instanceContext || {}

    return {
      domain,
      instanceName,
      scenarioName,
      variables: { ...variables },
      data: { ...data },
      state: ScenarioInstanceStatus[state],
      progress,
      timestamp: String(Date.now())
    }
  }
}
