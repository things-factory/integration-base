export * from './entities'
export * from './migrations'
export * from './graphql'
export * from './engine'

import './middlewares'
import './routes'

import gql from 'graphql-tag'
import { ScenarioEngine } from './engine'

process.on('bootstrap-module-start' as any, async ({ app, config, client }: any) => {
  ScenarioEngine.client = client
})
