import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'
import { ScenarioEngine, ScenarioInstanceStatus } from '../../../engine/scenario-engine'

/**
 * 동기적인 시나리오 호출
 * 호출된 시나리오가 종료된 후 그 결과를 리턴한다.
 */
export const callScenario = {
  async callScenario(_: any, { instanceName, scenarioName, variables }, context: any) {
    var repository = getRepository(Scenario)
    var scenario = await repository.findOne({
      where: { domain: context.state.domain, name: scenarioName },
      relations: ['domain', 'steps', 'creator', 'updater']
    })

    /* 시나리오 인스턴스를 생성한다. */
    instanceName = instanceName || scenarioName + '-standalone'
    var instance = new ScenarioEngine(instanceName, scenario, { variables })
    await instance.run()

    var { domain, context: instanceContext, progress } = instance
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
