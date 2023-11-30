import {FlatList, ViewToken, ViewabilityConfig} from 'react-native';
import React, {useRef, useState} from 'react';
import FeedPost from '../../components/FeedPost';
import {useQuery} from '@apollo/client';
import {ActivityIndicator} from 'react-native';
import {postsByDate} from './queries';
import {
  ModelSortDirection,
  PostsByDateQuery,
  PostsByDateQueryVariables,
} from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage';

const HomeScreen = () => {
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const {data, loading, error, refetch, fetchMore} = useQuery<
    PostsByDateQuery,
    PostsByDateQueryVariables
  >(postsByDate, {
    variables: {type: 'POST', sortDirection: ModelSortDirection.DESC, limit: 2},
  });

  const nextToken = data?.postsByDate?.nextToken;

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

  const loadMore = async () => {
    if (!nextToken || isFetchingMore) {
      return;
    }
    setIsFetchingMore(true);
    await fetchMore({variables: {nextToken}});
    setIsFetchingMore(false);
  };

  if (loading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return (
      <ApiErrorMessage title="Error fetching posts" message={error.message} />
    );
  }

  const posts = data?.postsByDate?.items || [];
  console.log('POSTS ', posts);

  return (
    <FlatList
      data={posts}
      renderItem={({item}) =>
        item && <FeedPost post={item} isVisible={activePostId === item.id} />
      }
      showsVerticalScrollIndicator={false}
      keyExtractor={item => `post-${item?.createdAt}`}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewabalityConfig}
      onRefresh={() => refetch()}
      refreshing={loading}
      onEndReached={() => loadMore()}
    />
  );
};

export default HomeScreen;
