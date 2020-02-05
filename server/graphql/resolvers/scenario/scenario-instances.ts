import { ScenarioEngine, ScenarioInstanceStatus } from '../../../engine/scenario-engine'
import { ListParam, convertListParams } from '@things-factory/shell'

export const scenarioInstancesResolver = {
  scenarioInstances(_: any, params: ListParam, context: any) {
    var scenarioInstances = ScenarioEngine.getScenarioInstances()
    /* IMPLEMENT-ME 검색 기능.. */
    const convertedParams = convertListParams(params, context.state.domain.id)

    var items = scenarioInstances.map(instance => {
      var { domain, instanceName, scenarioName, context: instanceContext, progress } = instance
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
    })

    return {
      items,
      total: items.length
    }
  }
}
