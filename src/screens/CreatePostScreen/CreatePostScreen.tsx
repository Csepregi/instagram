import React, {useState} from 'react';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {CreateRouteProp} from '../../types/navigation';
import colors from '../../theme/colors';
import {createPost} from './queries';
import {CreatePostMutation, CreatePostMutationVariables} from '../../API';
import {useMutation} from '@apollo/client';
import {useAuthContext} from '../../context/AuthContext';
import CustomButton from '../Auth/components/CustomButton';
import Carousel from '../../components/Carousel';
import VideoPlayer from '../../components/VideoPlayer';

const CreatePostScreen = () => {
  const [description, setDescription] = useState('');
  const route = useRoute<CreateRouteProp>();
  const {userId} = useAuthContext();
  const {image, images, video} = route.params;

  const [doCreatePost] = useMutation<
    CreatePostMutation,
    CreatePostMutationVariables
  >(createPost);

  let content = null;
  if (image) {
    content = (
      <Image
        source={{
          uri: image,
        }}
        style={styles.image}
      />
    );
  } else if (images) {
    console.log('images ', images);
    content = <Carousel images={images} />;
  } else if (video) {
    content = <VideoPlayer uri={video} />;
  }

  const submit = async () => {
    const response = await doCreatePost({
      variables: {
        input: {
          type: 'POST',
          description,
          image,
          nofComments: 0,
          nofLikes: 0,
          userID: userId,
        },
      },
    });
    console.log('Input ', response);
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>{content}</View>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description..."
        style={styles.input}
        multiline
        numberOfLines={5}
      />
      <CustomButton text="Submit" onPress={submit} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 10,
  },
  content: {
    width: '100%',
    aspectRatio: 3 / 2,
  },
  image: {
    width: 200,
    height: 200,
  },
  input: {
    marginVertical: 10,
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
  },
});

export default CreatePostScreen;
