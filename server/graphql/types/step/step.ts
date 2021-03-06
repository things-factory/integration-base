import gql from 'graphql-tag'

export const Step = gql`
  type Step {
    id: String
    name: String
    domain: Domain
    description: String
    scenario: Scenario
    sequence: Int
    task: String
    skip: Boolean
    log: Boolean
    connection: String
    params: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
