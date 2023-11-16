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
      createdAt
      updatedAt
      __typename
    }
  }
  ` 

  export const updateUser = gql`mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      name
      image
      bio
      username
      website
      createdAt
      updatedAt
      __typename
    }
  }
  `

  export const deleteUser = gql`mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
  `