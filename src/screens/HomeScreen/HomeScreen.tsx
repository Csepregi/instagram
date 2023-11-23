import {FlatList, Text, ViewToken, ViewabilityConfig} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import FeedPost from '../../components/FeedPost';
import { gql, useQuery } from '@apollo/client';
import { ActivityIndicator } from 'react-native';
import { listPosts } from './queries'
import { ListPostsQuery, ListPostsQueryVariables } from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage';


const HomeScreen = () => {
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const {data, loading, error, refetch} = useQuery<ListPostsQuery, ListPostsQueryVariables>(listPosts);

  const viewabalityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 51,
  };
  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: Array<ViewToken>}) => {
      if (viewableItems.length > 0) {
        setActivePostId(viewableItems[0].item.id);
      }
    },
  );

  if (loading) {
    return <ActivityIndicator />
  }
  if (error) {
    return <ApiErrorMessage title='Error fetching posts' message={error.message} />
  }

  const posts = data?.listPosts?.items || [];
  console.log('POSTS ', posts)

  return (
    <FlatList
      data={posts}
      renderItem={({item}) => (
        item && <FeedPost post={item} isVisible={activePostId === item.id} />
      )}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => `post-${item?.createdAt}`}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewabalityConfig}
      onRefresh={() => refetch()}
      refreshing={loading}
    />
  );
};

export default HomeScreen;
