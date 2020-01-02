import gql from 'graphql-tag'

export const PublishData = gql`
  type PublishData {
    tag: String!
    data: Object!
  }
`
