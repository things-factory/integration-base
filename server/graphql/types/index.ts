import * as Connection from './connection'
import * as Scenario from './scenario'
import * as Step from './step'
import * as Connector from './connector'
import * as TaskType from './task-type'
import * as PublishData from './publish-data'

import './object-type'
import { PropertySpec } from './property-spec'

export const queries = [Connection.Query, Scenario.Query, Step.Query, Connector.Query, TaskType.Query]

export const mutations = [Connection.Mutation, Scenario.Mutation, Step.Mutation]

export const subscriptions = [Scenario.Subscription, PublishData.Subscription]

export const types = [
  `scalar Object`,
  PropertySpec,
  ...Connection.Types,
  ...Scenario.Types,
  ...Step.Types,
  ...Connector.Types,
  ...TaskType.Types,
  ...PublishData.Types
]
