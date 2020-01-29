import gql from 'graphql-tag'

export const PublishData = gql`
  type PublishData {
    domain: Domain
    tag: String!
    data: Object!
  }
`
