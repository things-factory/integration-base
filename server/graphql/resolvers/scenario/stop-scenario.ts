import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'

export const stopScenario = {
  async stopScenario(_: any, { instanceName }, context: any) {
    /* TODO scenario engine에서 처리해야 한다. */
    var repository = getRepository(Scenario)
    var scenario = await repository.findOne({
      where: { domain: context.state.domain, name: instanceName },
      relations: ['domain', 'steps', 'creator', 'updater']
    })

    await scenario.stop()
    await repository.save(scenario)

    return scenario
  }
}
