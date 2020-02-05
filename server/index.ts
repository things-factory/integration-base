export * from './entities'
export * from './migrations'
export * from './graphql'
export * from './engine'

import './middlewares'
import './routes'

import { ScenarioEngine } from './engine'
import { createLocalClient } from './graphql-local-client'

process.on('bootstrap-module-start' as any, async ({ app, config, schema }: any) => {
  ScenarioEngine.client = createLocalClient(schema)
})
