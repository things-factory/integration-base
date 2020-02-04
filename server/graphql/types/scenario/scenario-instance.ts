import gql from 'graphql-tag'

export const ScenarioInstance = gql`
  type ScenarioInstance {
    domain: Domain
    instanceName: String
    scenarioName: String
    state: ScenarioStatus
    data: Object
    variables: Object
  }
`
