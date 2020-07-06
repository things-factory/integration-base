import gql from 'graphql-tag'

export const StepPatch = gql`
  input StepPatch {
    id: String
    name: String
    description: String
    sequence: Int
    task: String
    skip: Boolean
    log: Boolean
    connection: String
    params: String
    cuFlag: String
  }
`
