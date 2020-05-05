import { ScenarioEngine, ScenarioInstanceStatus } from '../../../engine/scenario-engine'

export const scenarioInstanceResolver = {
  scenarioInstance(_: any, { instanceName }, context: any) {
    var scenarioInstance = ScenarioEngine.getScenarioInstance(instanceName)
    if (!scenarioInstance) {
      throw `ScenarioInstance(${instanceName}) Not Found.`
    }

    var { domain, scenarioName } = scenarioInstance

    if (context.state.domain.id !== domain.id) {
      throw `ScenarioInstance(${instanceName}) Not Found in domain(${context.state.domain.name}).`
    }

    var { domain, scenarioName, context: instanceContext, progress } = scenarioInstance
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
