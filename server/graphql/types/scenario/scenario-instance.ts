import gql from 'graphql-tag'

export const ScenarioInstance = gql`
  enum ScenarioInstanceStatus {
    READY
    STARTED
    PAUSED
    STOPPED
    HALTED
  }

  type ScenarioInstanceProgress {
    rounds: Int!
    rate: Int!
    steps: Int!
    step: Int!
  }

  type ScenarioInstance {
    domain: Domain!
    instanceName: String!
    scenarioName: String!
    state: ScenarioInstanceStatus
    progress: ScenarioInstanceProgress
    variables: Object
    data: Object
    message: String
    timestamp: String!
  }
`
