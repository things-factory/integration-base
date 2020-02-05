import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'
import { ScenarioEngine, ScenarioInstanceStatus } from '../../../engine/scenario-engine'

export const stopScenario = {
  async stopScenario(_: any, { instanceName }, context: any) {
    /* TODO scenario engine에서 처리해야 한다. */
    var scenarioInstance = ScenarioEngine.getScenarioInstance(instanceName)

    if (!scenarioInstance) {
      throw `ScenarioInstance(${instanceName}) Not Found.`
    }

    var { domain, scenarioName } = scenarioInstance

    if (context.state.domain.id !== domain.id) {
      throw `ScenarioInstance(${instanceName}) Not Found in domain(${context.state.domain.name}).`
    }

    await ScenarioEngine.unload(instanceName)
    if (scenarioName == instanceName) {
      var repository = getRepository(Scenario)

      var scenario = await repository.findOne({
        where: { domain: context.state.domain, name: instanceName },
        relations: ['domain', 'steps', 'creator', 'updater']
      })

      scenario.status = 0
      await repository.save(scenario)
    }

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
