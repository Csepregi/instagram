import React from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {likesForPostByUser} from './queries';
import {useQuery} from '@apollo/client';
import {
  LikesForPostByUserQuery,
  LikesForPostByUserQueryVariables,
} from '../../API';
import {useRoute} from '@react-navigation/native';
import {PostLikesRouteProp} from '../../types/navigation';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import UserListItem from '../../components/UserListItem';

export default function PostLikesScreen() {
  const route = useRoute<PostLikesRouteProp>();
  const {id} = route.params;
  const {data, loading, error} = useQuery<
    LikesForPostByUserQuery,
    LikesForPostByUserQueryVariables
  >(likesForPostByUser, {variables: {postID: id}});

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <ApiErrorMessage title="Error fetching likes" message={error.message} />
    );
  }

  const likes = data?.likesForPostByUser?.items || [];
  return (
    <>
      <FlatList
        data={likes}
        renderItem={({item}) => console.log('ITEM ', item)}
      />
    </>
  );
}
