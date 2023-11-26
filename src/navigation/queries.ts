import {gql} from '@apollo/client';

// export const getUser = gql`
//   query GetUser($id: ID!) {
//     getUser(id: $id) {
//       id
//       username
//     }
//   }
// `;

export const getUser = gql`
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
