import { PublishData } from './publish-data'

export const Subscription = `
  publishData(tag: String): PublishData
`

export const Types = [PublishData]
