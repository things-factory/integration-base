import gql from 'graphql-tag'

export const NewScenario = gql`
  input NewScenario {
    name: String!
    description: String
    schedule: String
    timezone: String
    active: Boolean
  }
`
