import {useMutation, useQuery} from '@apollo/client';
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
  GetPostQuery,
  GetPostQueryVariables,
  UpdatePostMutation,
  UpdatePostMutationVariables,
} from '../../API';
import {createComment, getPost, updatePost} from './queries';
import {useAuthContext} from '../../context/AuthContext';
import {Alert} from 'react-native';

const useCommentsService = (postId: string) => {
  const {userId} = useAuthContext();
  const {data: postData} = useQuery<GetPostQuery, GetPostQueryVariables>(
    getPost,
    {variables: {id: postId}},
  );
  const post = postData?.getPost;
  const [doCreateComment] = useMutation<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >(createComment, {refetchQueries: ['CommentsByPost']});

  const [doUpdatePost] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(updatePost);

  const incrementNofComments = (amount: 1 | -1) => {
    if (!post) {
      Alert.alert('Failed to load post. Try again later');
      return;
    }
    doUpdatePost({
      variables: {
        input: {
          id: post?.id,
          nofComments: post?.nofComments + amount,
        },
      },
    });
  };

  const onCreateComment = async (newComment: string) => {
    if (!post) {
      Alert.alert('Failed to load post. Try again later');
      return;
    }
    try {
      doCreateComment({
        variables: {
          input: {
            postID: post?.id,
            userID: userId,
            comment: newComment,
          },
        },
      });
      incrementNofComments(1);
    } catch (error) {
      Alert.alert('Error submitting the post');
    }
  };

  return {
    incrementNofComments,
    onCreateComment,
  };
};

export default useCommentsService;
