import { getRepository, In } from 'typeorm'
import { Scenario, Step } from '../../../entities'
import uuid from 'uuid/v4'

export const copyScenarios = {
  async copyScenarios(_: any, { ids }, context: any) {
    const originals = await getRepository(Scenario).find({
      where: {
        id: In(ids),
        domain: context.state.domain.id
      },
      relations: ['domain', 'steps']
    })

    if (originals.length == 0) return false

    var newSteps = []

    var newCopys = originals.map(scenario => {
      let scenarioId = uuid()
      newSteps.push(
        ...scenario.steps.map(step => {
          return {
            scenario: scenarioId,
            name: step.name,
            description: step.name,
            sequence: step.sequence,
            task: step.task,
            connection: step.connection,
            params: step.params,

            domain: context.state.domain.id,
            creator: context.state.user,
            updater: context.state.user
          }
        })
      )

      return {
        id: scenarioId,
        name: scenario.name + ' (' + scenarioId + ')',
        description: scenario.description,
        active: false,
        status: 0,
        schedule: scenario.schedule,
        timezone: scenario.timezone,

        domain: scenario.domain,
        creator: context.state.user,
        updater: context.state.user
      }
    })

    var copiedScenarios = await getRepository(Scenario).save(newCopys)
    var copiedSteps = await getRepository(Step).save(newSteps)

    return copiedScenarios.map(scenario => {
      scenario.steps = copiedSteps.filter(step => step.scenario == scenario.id)
      return scenario
    })
  }
}
