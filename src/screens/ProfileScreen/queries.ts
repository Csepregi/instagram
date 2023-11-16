import { gql } from "@apollo/client";

export const getUser = gql`query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      image
      noPosts
      bio
      username
      email
      noFollowers
      noFollowings
      website
      Posts {
        nextToken
        __typename
        items {
            id
            image
            images
            video
        }
      }
      createdAt
      updatedAt
      __typename
    }
  }
  `