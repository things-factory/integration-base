import gql from 'graphql-tag'

export const PropertySpec = gql`
  type PropertySpec {
    type: String!
    label: String!
    name: String!
    placeholder: String
    property: Object
  }
`
