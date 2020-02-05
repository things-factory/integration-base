import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'
import { ScenarioEngine, ScenarioInstanceStatus } from '../../../engine/scenario-engine'

export const startScenario = {
  async startScenario(_: any, { instanceName, scenarioName, variables }, context: any) {
    var repository = getRepository(Scenario)
    var scenario = await repository.findOne({
      where: { domain: context.state.domain, name: scenarioName },
      relations: ['domain', 'steps', 'creator', 'updater']
    })

    /* TODO scenario-instance 엔티티를 지원해야 한다. */
    var scenarioInstance = await ScenarioEngine.load(instanceName || scenarioName, scenario, { variables })

    // await scenario.start(instanceName || scenarioName, variables)
    if (!instanceName || scenarioName == instanceName) {
      scenario.status = 1
      await repository.save(scenario)
    }

    var { domain, context: instanceContext, progress } = scenarioInstance
    var { variables: instanceVariables, data, state } = instanceContext || {}

    return {
      domain,
      instanceName,
      scenarioName,
      variables: { ...instanceVariables },
      data: { ...data },
      state: ScenarioInstanceStatus[state],
      progress,
      timestamp: String(Date.now())
    }
  }
}
