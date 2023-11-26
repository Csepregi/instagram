import {gql} from '@apollo/client';

// export const getUser = gql`
//   query GetUser($id: ID!) {
//     getUser(id: $id) {
//       id
//       name
//       image
//       noPosts
//       bio
//       username
//       email
//       noFollowers
//       noFollowings
//       website
//       createdAt
//       updatedAt
//       __typename
//     }
//   }
// `;

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
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
        items {
          id
          description
          images
          image
          video
          nofComments
          nofLikes
          userID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      Comments {
        items {
          id
          comment
          userID
          postID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      Likes {
        items {
          id
          comment
          userID
          postID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const updateUser = gql`
  mutation UpdateUser(
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
`;

export const deleteUser = gql`
  mutation DeleteUser(
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
`;

export const usersByUsername = gql`query UsersByUsername(
    $username: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByUsername(
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        username
       
      nextToken
      __typename
    }
  }
  `;
