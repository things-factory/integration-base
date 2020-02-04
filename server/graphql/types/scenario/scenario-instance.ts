import gql from 'graphql-tag'

export const ScenarioInstance = gql`
  type ScenarioInstance {
    domain: Domain
    instanceName: String
    scenarioName: String
    state: Int
    data: Object
    variables: Object
  }
`
