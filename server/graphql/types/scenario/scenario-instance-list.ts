import gql from 'graphql-tag'

export const ScenarioInstanceList = gql`
  type ScenarioInstanceList {
    items: [ScenarioInstance]
    total: Int
  }
`
