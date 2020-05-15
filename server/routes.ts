import koaBodyParser from 'koa-bodyparser'
import { ScenarioFlow } from './entities/scenario-flow'
import { secureRouter } from '@things-factory/auth-base/dist-server/router'

import { getRepository } from 'typeorm'

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  var paths = ['get-flows', 'save-flows']
  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
})

process.on('bootstrap-module-route' as any, (app, router) => {
  const bodyParserOption = {
    formLimit: '10mb',
    jsonLimit: '10mb',
    textLimit: '10mb'
  }

  secureRouter.get('/get-flows/:domainId', async (context, next) => {
    const { user } = context.state

    if (!user) {
      context.status = 403
      context.body = {
        success: false,
        message: 'unauthorized'
      }

      return
    }

    const { domainId } = context.params
    const flowRepo = getRepository(ScenarioFlow)
    var flow: Partial<ScenarioFlow> = await flowRepo.findOne({
      where: {
        domain: domainId
      }
    })

    if (!flow)
      flow = {
        domain: domainId,
        flow: null
      }

    context.body = {
      success: true,
      flow: JSON.parse(flow.flow)
    }
  })

  secureRouter.post('/save-flows/:domainId', koaBodyParser(bodyParserOption), async (context, next) => {
    const { user } = context.state

    if (!user) {
      context.status = 403
      context.body = {
        success: false,
        message: 'unauthorized'
      }

      return
    }

    const { domainId } = context.params
    const { flows } = context.request.body
    const flowRepo = getRepository(ScenarioFlow)

    var flowJson = JSON.stringify(flows)

    var originFlow: Partial<ScenarioFlow> = await flowRepo.findOne({
      where: {
        domain: domainId
      }
    })

    if (!originFlow)
      originFlow = {
        domain: domainId
      }

    originFlow.flow = flowJson

    const flow = await flowRepo.save(originFlow)

    context.body = {
      success: true,
      flow: flow || []
    }
  })
})
