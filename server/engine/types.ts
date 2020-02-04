import { Connection } from '../entities'

export interface PropertySpec {
  type: string
  label: string
  name: string
  placeholder?: string
  property?: any
}

export interface Connector {
  ready(connections: Connection[]): Promise<any>
  connect(connection: Connection): Promise<any>
  disconnect(name: string): Promise<any>
  parameterSpec: PropertySpec[]
}

export interface Step {
  sequence?: string
  type: string /* task */
  connection?: string /* TODO should be a connection name of params */
  name?: string /* TODO should be one of params for task */
  [propName: string]: any
}

export enum SCENARIO_STATE {
  READY,
  STARTED,
  PAUSED,
  STOPPED,
  HALTED
}

export type Context = {
  domain: Object
  logger: any
  publish: Function
  load: Function
  state: SCENARIO_STATE
  data: Object
  variables: Object
  client: Object /* graphql local client */
  root: Object
}

export type TaskHandler = (
  step: Step,
  context: Context
) => Promise<{
  next?: string
  state?: SCENARIO_STATE
  data?: any
}>
