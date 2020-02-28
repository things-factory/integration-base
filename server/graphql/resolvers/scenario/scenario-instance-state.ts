import { pubsub } from '@things-factory/shell'
import { logger } from '@things-factory/env'
import { withFilter } from 'graphql-subscriptions'

export const scenarioInstanceState = {
  scenarioInstanceState: {
    /* subscription payload can be filtered here */
    // resolve(payload, args) {
    //   return payload.publishData
    // },
    // subscribe(_, args, { ctx }) {
    /* it is possible to check authentication here */
    // if (!ctx.user) {
    //   return null
    // }
    // return pubsub.asyncIterator('scenario-instance-state')
    // }
    // subscribe(_, args, { ctx }) {
    //   /* it is possible to check authentication here */
    //   // logger.warn(`context user: ${ctx.user}`)
    //   // if (!ctx.user) {
    //   //   return null
    //   // }

    //   // return pubsub.asyncIterator('scenario-instance-state')
    //   return withFilter(
    //     () => pubsub.asyncIterator('scenario-instance-state'),
    //     (payload, variables, context, info) => {
    //       logger.warn(`context: ${context}, info: ${info}`)
    //       return (
    //         // payload.domain.id === context.domain.id &&
    //         !variables.name || payload.scenarioInstanceState.name === variables.name
    //       )
    //     }
    //   )
    // }
    subscribe: withFilter(
      () => pubsub.asyncIterator('scenario-instance-state'),
      (payload, variables, context, info) => {
        logger.warn(`context: ${JSON.stringify(context, null, 2)}`)

        var { instanceName, scenarioName } = variables

        if (scenarioName && payload.scenarioInstanceState.scenarioName != scenarioName) {
          return false
        }

        if (instanceName && payload.scenarioInstanceState.instanceName != instanceName) {
          return false
        }

        return true
      }
    )
  }
}
