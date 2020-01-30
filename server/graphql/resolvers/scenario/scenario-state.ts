import { pubsub } from '@things-factory/shell'
import { logger } from '@things-factory/env'
import { withFilter } from 'graphql-subscriptions'

export const scenarioState = {
  scenarioState: {
    /* subscription payload can be filtered here */
    // resolve(payload, args) {
    //   return payload.systemRebooted
    // },
    // subscribe(_, args, { ctx }) {
    /* it is possible to check authentication here */
    // if (!ctx.user) {
    //   return null
    // }
    // return pubsub.asyncIterator('scenario-state')
    // }
    // subscribe(_, args, { ctx }) {
    //   /* it is possible to check authentication here */
    //   // logger.warn(`context user: ${ctx.user}`)
    //   // if (!ctx.user) {
    //   //   return null
    //   // }

    //   // return pubsub.asyncIterator('scenario-state')
    //   return withFilter(
    //     () => pubsub.asyncIterator('scenario-state'),
    //     (payload, variables, context, info) => {
    //       logger.warn(`context: ${context}, info: ${info}`)
    //       return (
    //         // payload.domain.id === context.domain.id &&
    //         !variables.name || payload.scenarioState.name === variables.name
    //       )
    //     }
    //   )
    // }
    subscribe: withFilter(
      () => pubsub.asyncIterator('scenario-state'),
      (payload, variables, context, info) => {
        logger.warn(`context: ${JSON.stringify(context, null, 2)}`)
        return !variables.name || payload.scenarioState.name === variables.name
      }
    )
  }
}
