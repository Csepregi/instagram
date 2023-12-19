import {gql} from '@apollo/client';

export const getUser = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      username
      bio
      website
      noPosts
      noFollowers
      noFollowings
      image
      Posts {
        nextToken
        items {
          id
          image
          images
          video
        }
      }
      createdAt
      updatedAt
    }
  }
`;
