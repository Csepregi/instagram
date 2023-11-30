import {useEffect, useState} from 'react';
import {View, Image, Text, Pressable} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {FeedNavigationProp} from '../../types/navigation';
import React from 'react';
import colors from '../../theme/colors';
import styles from './style';
import Comment from '../Comment/Comment';
import {
  CreateLikeMutation,
  CreateLikeMutationVariables,
  DeleteLikeMutation,
  DeleteLikeMutationVariables,
  LikesForPostByUserQuery,
  LikesForPostByUserQueryVariables,
  Post,
} from '../../API';
import PostMenu from './PostMenu';
import {useMutation, useQuery} from '@apollo/client';
import {createLike, likesForPostByUser, deleteLike} from './queries';
import {useAuthContext} from '../../context/AuthContext';
import dayjs from 'dayjs';
import Content from './Content';
import UserImage from '../UserImage';

interface IFeedPost {
  post: Post;
  isVisible: boolean;
}

const FeedPost = ({post, isVisible}: IFeedPost) => {
  const {userId} = useAuthContext();
  const navigation = useNavigation<FeedNavigationProp>();
  const [isDescriptionExpended, setIsDescriptionExpended] = useState(false);

  const [doCreateLike] = useMutation<
    CreateLikeMutation,
    CreateLikeMutationVariables
  >(createLike, {
    variables: {
      input: {
        userID: userId,
        postID: post.id,
        comment: '',
      },
    },
    refetchQueries: ['LikesForPostByUser'],
  });

  const [doDeleteLike] = useMutation<
    DeleteLikeMutation,
    DeleteLikeMutationVariables
  >(deleteLike);

  const {data: usersLikeData} = useQuery<
    LikesForPostByUserQuery,
    LikesForPostByUserQueryVariables
  >(likesForPostByUser, {variables: {postID: post.id, userID: {eq: userId}}});

  const userLike = usersLikeData?.likesForPostByUser?.items?.[0];

  const toggleDescriptionExpended = () => {
    setIsDescriptionExpended(v => !v);
  };

  const toggleLike = async () => {
    if (userLike) {
      //delete user like
      await doDeleteLike({variables: {input: {id: userLike.id}}});
    } else {
      doCreateLike();
    }
  };

  const navigateToUser = () => {
    if (post.User) {
      navigation.navigate('UserProfile', {userId: post.User?.id});
    }
  };

  const navigateToComments = () => {
    navigation.navigate('Comments', {postId: post.id});
  };

  const navigateToLikes = () => {
    navigation.navigate('PostLikes', {id: post.id});
  };

  return (
    <View style={styles.post}>
      {/* Hedaer */}
      <View style={styles.header}>
        <UserImage imageKey={post?.User?.image} />
        <Text style={styles.userName} onPress={navigateToUser}>
          {post.User?.username}
        </Text>
        <PostMenu post={post} />
      </View>
      {/* Content */}
      <Content post={post} isVisible={isVisible} toggleLike={toggleLike} />
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <Pressable onPress={toggleLike}>
            <AntDesign
              name={userLike ? 'heart' : 'hearto'}
              size={24}
              style={styles.icon}
              color={userLike ? colors.accent : colors.black}
            />
          </Pressable>
          <Ionicons
            name="chatbubble-outline"
            size={24}
            style={styles.icon}
            color={colors.black}
          />
          <Feather
            name="send"
            size={24}
            style={styles.icon}
            color={colors.black}
          />
          <Feather
            name="bookmark"
            size={24}
            style={{marginLeft: 'auto'}}
            color={colors.black}
          />
        </View>
        <Text style={styles.text} onPress={navigateToLikes}>
          Liked by <Text style={styles.bold}>vicius44 </Text> and{' '}
          <Text style={styles.bold}>{post.nofLikes} others</Text>
        </Text>

        {/* Post Description */}
        <Text style={styles.text} numberOfLines={2}>
          <Text style={styles.bold}>{post.User?.username} </Text>
          {post.description}
        </Text>
        <Text onPress={toggleDescriptionExpended}>
          {isDescriptionExpended ? 'less' : 'more'}
        </Text>
        {/* Comments */}
        <Text onPress={navigateToComments}>
          View all {post.nofComments} comments
        </Text>
        {(post.Comments?.items || [])?.map(
          comment => comment && <Comment key={comment.id} comment={comment} />,
        )}
        {/* Posted Date */}
        <Text>{dayjs(post.createdAt).fromNow()}</Text>
      </View>
    </View>
  );
};

export default FeedPost;
