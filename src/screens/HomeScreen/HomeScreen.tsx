import {FlatList, Text, ViewToken, ViewabilityConfig} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import FeedPost from '../../components/FeedPost';
import { gql, useQuery } from '@apollo/client';
import { ActivityIndicator } from 'react-native';
import { listPosts } from './queries'


const HomeScreen = () => {
  const [activePostId, setActivePostId] = useState<string | null>(null);
  //const [posts, setPosts] = useState([]);
  const {data, loading, error} = useQuery(listPosts);


  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const response = await API.graphql(graphqlOperation(listPosts));
  //     console.log(response.data.listPosts.items);
  //     setPosts(response.data.listPosts.items);
  //   };

  //   fetchPosts();
  // }, []);



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
    return <Text>{error.message}</Text>
  }

  const posts = data.listPosts.items;

  return (
    <FlatList
      data={posts}
      renderItem={({item}) => (
        <FeedPost post={item} isVisible={activePostId === item.id} />
      )}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => `post-${item.createdAt}`}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabalityConfig={viewabalityConfig}
    />
  );
};

export default HomeScreen;
