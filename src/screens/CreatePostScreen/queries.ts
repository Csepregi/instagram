import { gql } from "@apollo/client";

export const createPost = gql`mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      description
      images
      image
      video
      nofComments
      nofLikes
      userID
      User {
        id
        noPosts
      createdAt
      updatedAt
      __typename
    }
  }
}
`