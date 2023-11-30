import React, {useState} from 'react';
import {Alert, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CreateRouteProp} from '../../types/navigation';
import colors from '../../theme/colors';
import {createPost} from './queries';
import {
  CreatePostInput,
  CreatePostMutation,
  CreatePostMutationVariables,
} from '../../API';
import {useMutation} from '@apollo/client';
import {useAuthContext} from '../../context/AuthContext';
import CustomButton from '../Auth/components/CustomButton';
import Carousel from '../../components/Carousel';
import VideoPlayer from '../../components/VideoPlayer';
import {Storage} from 'aws-amplify';
import Navigation from '../../navigation';
import {v4 as uuidV4} from 'uuid';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [description, setDescription] = useState('');
  const route = useRoute<CreateRouteProp>();
  const {userId} = useAuthContext();
  const {image, images, video} = route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

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
        resizeMode={'contain'}
      />
    );
  } else if (images) {
    console.log('images ', images);
    content = <Carousel images={images} />;
  } else if (video) {
    content = <VideoPlayer uri={video} />;
  }

  const submit = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    const input: CreatePostInput = {
      type: 'POST',
      description,
      image: undefined,
      images: undefined,
      video: undefined,
      nofComments: 0,
      nofLikes: 0,
      userID: userId,
    };
    // upload the media files to s3 and get the key
    if (image) {
      input.image = await uploadMedia(image);
    } else if (images) {
      const imageKeys = await Promise.all(images.map(img => uploadMedia(img)));
      input.images = imageKeys.filter(key => key) as string[];
    } else if (video) {
      input.video = await uploadMedia(video);
    }
    try {
      await doCreatePost({variables: {input}});
      setIsSubmitting(false);
      //navigation.popToTop()
      navigation.navigate('HomeStack');
    } catch (error) {
      Alert.alert('Error uploading the post', (error as Error).message);
      setIsSubmitting(false);
    }
  };

  const uploadMedia = async (uri: string) => {
    try {
      // get the blob of the file from uri
      const response = await fetch(uri);
      const blob = await response.blob();
      // upload the file (blob) to s3
      console.log('blob ', blob);
      const urlParts = uri.split('.');
      const extension = urlParts[urlParts.length - 1];
      const s3Response = await Storage.put(`${uuidV4()}.${extension}`, blob, {
        progressCallback(newProgress) {
          setProgress(newProgress.loaded / newProgress.total);
        },
      });
      console.log('S3RESPONSE ', s3Response);
      return s3Response.key;
    } catch (error) {
      console.log('Errror ', error);
      Alert.alert('Error uploading the the photo');
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.root}>
      <View style={styles.content}>{content}</View>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description..."
        style={styles.input}
        multiline
        numberOfLines={5}
      />
      <CustomButton
        text={isSubmitting ? 'Submitting' : 'Submit'}
        onPress={submit}
      />
      {isSubmitting && (
        <View style={styles.progressContainer}>
          <View style={[styles.progress, {width: `${progress * 100}%`}]}>
            <Text>Uploading {Math.floor(progress * 100)}%</Text>
          </View>
        </View>
      )}
    </KeyboardAwareScrollView>
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
    width: '100%',
    aspectRatio: 3 / 2,
  },
  input: {
    marginVertical: 10,
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
  },
  progressContainer: {
    backgroundColor: colors.lightgray,
    width: '100%',
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginVertical: 10,
  },
  progress: {
    backgroundColor: colors.primary,
    position: 'absolute',
    height: '100%',
    width: '30%',
    alignSelf: 'flex-start',
    borderRadius: 25,
  },
});

export default CreatePostScreen;
