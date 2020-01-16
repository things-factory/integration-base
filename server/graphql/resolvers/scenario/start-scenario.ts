import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'

export const startScenario = {
  async startScenario(_: any, { name }, context: any, data?: any) {
    var repository = getRepository(Scenario)
    var scenario = await repository.findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'steps', 'creator', 'updater']
    })

    await scenario.start(data)
    await repository.save(scenario)

    return scenario
  }
}
