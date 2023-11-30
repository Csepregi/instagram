import {Alert, StyleSheet, Text} from 'react-native';
import {
  Menu,
  renderers,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import Entypo from 'react-native-vector-icons/Entypo';
import {deletePost} from './queries';
import {useMutation} from '@apollo/client';
import {DeletePostMutation, DeletePostMutationVariables, Post} from '../../API';
import {useAuthContext} from '../../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {FeedNavigationProp} from '../../types/navigation';
import {Storage} from 'aws-amplify';

interface IPostMenu {
  post: Post;
}

const PostMenu = ({post}: IPostMenu) => {
  const navigation = useNavigation<FeedNavigationProp>();
  const {userId} = useAuthContext();
  const isMyPost = userId === post.userID;
  const [doDeletePost] = useMutation<
    DeletePostMutation,
    DeletePostMutationVariables
  >(deletePost, {variables: {input: {id: post.id}}});

  const startDeletingPress = async () => {
    if (post.image) {
      await Storage.remove(post.image);
    }
    if (post.video) {
      await Storage.remove(post.video);
    }
    if (post.images) {
      await Promise.all(post.images.map(img => Storage.remove(img)));
    }
    try {
      const response = await doDeletePost();
      console.log('RESPONSE POST ', response);
    } catch (error) {
      Alert.alert('Failed to delete post', (error as Error).message);
    }
  };

  const onDeleteOptionPress = () => {
    Alert.alert('Are you sure', 'Deleting a post is permanent', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete post',
        style: 'destructive',
        onPress: startDeletingPress,
      },
    ]);
  };

  const onEditOptionPress = () => {
    navigation.navigate('UpdatePost', {id: post.id});
  };

  return (
    <Menu renderer={renderers.SlideInMenu} style={styles.threeDots}>
      <MenuTrigger>
        <Entypo name="dots-three-horizontal" size={16} />
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={() => Alert.alert('Reporting')}>
          <Text style={styles.optionText}>Report</Text>
        </MenuOption>
        {isMyPost && (
          <>
            <MenuOption onSelect={onDeleteOptionPress}>
              <Text style={[styles.optionText, {color: 'red'}]}>Delete</Text>
            </MenuOption>
            <MenuOption onSelect={onEditOptionPress}>
              <Text style={[styles.optionText]}>Edit</Text>
            </MenuOption>
          </>
        )}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  threeDots: {
    marginLeft: 'auto',
  },
  optionText: {
    textAlign: 'center',
    fontSize: 20,
    padding: 10,
  },
});

export default PostMenu;
