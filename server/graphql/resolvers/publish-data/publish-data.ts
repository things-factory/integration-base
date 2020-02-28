import { pubsub } from '@things-factory/shell'
import { logger } from '@things-factory/env'
import { withFilter } from 'graphql-subscriptions'

export const publishData = {
  publishData: {
    /* subscription payload can be filtered here */
    // resolve(payload, args) {
    //   return payload.publishData
    // },
    // subscribe(_, args, { ctx }) {
    //   /* it is possible to check authentication here */
    //   logger.warn(`context user: ${ctx.user}`)
    //   if (!ctx.user) {
    //     return null
    //   }

    //   // return pubsub.asyncIterator('publish-data')
    //   return withFilter(
    //     () => pubsub.asyncIterator('publish-data'),
    //     (payload, variables, context, info) => {
    //       logger.warn(`context: ${context}, info: ${info}`)
    //       return (
    //         payload.domain.id === context.domain.id && (!variables.tag || payload.publishData.tag === variables.tag)
    //       )
    //     }
    //   )
    // }
    subscribe: withFilter(
      () => pubsub.asyncIterator('publish-data'),
      (payload, variables, context, info) => {
        return !variables.tag || payload.publishData.tag === variables.tag
      }
    )
  }
}
