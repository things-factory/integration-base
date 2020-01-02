import { pubsub } from '@things-factory/shell'
import { withFilter } from 'apollo-server-koa'

export const publishData = {
  publishData: {
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
    subscribe: withFilter(
      () => pubsub.asyncIterator('publish-data'),
      (payload, variables) => {
        return !variables.tag || payload.publishData.tag === variables.tag
      }
    )
  }
}
