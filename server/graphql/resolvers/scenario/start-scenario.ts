import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'

export const startScenario = {
  async startScenario(_: any, { instanceName, scenarioName, variables }, context: any) {
    var repository = getRepository(Scenario)
    var scenario = await repository.findOne({
      where: { domain: context.state.domain, name: scenarioName },
      relations: ['domain', 'steps', 'creator', 'updater']
    })

    /* TODO scenario-instance 엔티티를 지원해야 한다. */
    await scenario.start(instanceName || scenarioName, variables)
    await repository.save(scenario)

    return scenario
  }
}
