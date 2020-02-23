import gql from 'graphql-tag'

export const NewStep = gql`
  input NewStep {
    name: String!
    description: String
    sequence: Int
    task: String
    skip: Boolean
    errorBreakMain: Boolean
    connection: String
    params: String
  }
`
