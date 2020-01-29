import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'

export const startScenario = {
  async startScenario(_: any, { name, data="{}" }, context: any) {
    var repository = getRepository(Scenario)
    var scenario = await repository.findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'steps', 'creator', 'updater']
    })

    await scenario.start({
      'INIT': JSON.parse(data)
    })
    await repository.save(scenario)

    return scenario
  }
}
