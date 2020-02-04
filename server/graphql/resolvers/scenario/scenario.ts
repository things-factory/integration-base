import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'
import { ScenarioEngine } from '../../../engine'

export const scenarioResolver = {
  async scenario(_: any, { id }, context: any) {
    var scenario = await getRepository(Scenario).findOne({
      where: { domain: context.state.domain, id },
      relations: ['domain', 'steps', 'creator', 'updater']
    })

    /* TODO scenario-instance 엔티티 개념이 필요하다. */
    if (scenario) {
      scenario.status = ScenarioEngine.getScenarioInstance(scenario.name) ? 1 : 0
    }

    return scenario
  }
}
