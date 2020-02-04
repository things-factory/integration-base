import { ScenarioEngine } from '../../../engine/scenario-engine'
import { ListParam, convertListParams } from '@things-factory/shell'

export const scenarioInstancesResolver = {
  scenarioInstances(_: any, params: ListParam, context: any) {
    var scenarioInstances = ScenarioEngine.getScenarioInstances()
    const convertedParams = convertListParams(params, context.state.domain.id)

    var items = scenarioInstances.map(instance => {
      var { domain, instanceName, scenarioName, context } = instance
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
