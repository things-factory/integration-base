import koaBodyParser from 'koa-bodyparser'
import { ScenarioFlow } from './entities/scenario-flow'
import { secureRouter } from '@things-factory/auth-base'
import { getRepository } from 'typeorm'
import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
// import Router from 'koa-router'

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  var paths = ['flows', 'integration-modeller-token', 'integration-modeller']
  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
})

process.on('bootstrap-module-route' as any, (app, router) => {
  const bodyParserOption = {
    formLimit: '10mb',
    jsonLimit: '10mb',
    textLimit: '10mb'
  }

  secureRouter
    .get('/flows/:domainId', async (context, next) => {
      const { user } = context.state

      if (!user) {
        context.status = 401
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

    .post('/flows/:domainId', koaBodyParser(bodyParserOption), async (context, next) => {
      const { user } = context.state

      if (!user) {
        context.status = 401
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

    .get('/integration-modeller', async (context, next) => {
      const { user } = context.state

      const settingObj: { url?; username?; password? } = {}

      if (!user) {
        context.status = 401
        context.body = {
          success: false,
          message: 'unauthorized'
        }

        return
      }

      const settingRepo = getRepository('settings')
      if (!settingRepo) return await context.redirect('/')

      const settings = await settingRepo.find({
        where: {
          cetagory: 'integration'
        }
      })

      if (!settings) return await context.redirect('/')

      settings.forEach((setting: any) => {
        var key = setting.name.replace(/integration\.modeller-(\w+)/, '$1')
        if (key) settingObj[key] = setting.value
      })

      const { url, username, password } = settingObj

      const searchParams = new URLSearchParams()
      searchParams.append('client_id', 'node-red-admin')
      searchParams.append('grant_type', 'password')
      searchParams.append('scope', '*')
      searchParams.append('username', username)
      searchParams.append('password', password)

      const response = await fetch(`${url}/auth/token`, {
        method: 'POST',
        body: searchParams
      })

      const token = await response.json()

      await context.redirect(`${url}?access_token=${token.access_token}`)
      return
    })
})
