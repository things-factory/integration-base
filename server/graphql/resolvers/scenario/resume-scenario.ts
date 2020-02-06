import { ScenarioEngine, ScenarioInstanceStatus } from '../../../engine/scenario-engine'

export const resumeScenario = {
  async resumeScenario(_: any, { instanceName }, context: any) {
    /* TODO scenario engine에서 처리해야 한다. */
    var scenarioInstance = ScenarioEngine.getScenarioInstance(instanceName)

    if (!scenarioInstance) {
      throw `ScenarioInstance(${instanceName}) Not Found.`
    }

    var { domain, scenarioName } = scenarioInstance

    if (context.state.domain.id !== domain.id) {
      throw `ScenarioInstance(${instanceName}) Not Found in domain(${context.state.domain.name}).`
    }

    scenarioInstance.resume()

    var { context: instanceContext, progress } = scenarioInstance
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
