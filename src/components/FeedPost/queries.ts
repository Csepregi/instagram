import { gql } from "@apollo/client";

export const deletePost = gql`mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      __typename
    }
  }
  `