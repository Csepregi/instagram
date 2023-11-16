import { gql } from "@apollo/client";

export const listUsers = gql`query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        image
        username
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
  `