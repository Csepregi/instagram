import React, {useEffect, useState} from 'react';
import DoublePressable from '../DoublePressable';
import {ActivityIndicator, Image, View} from 'react-native';
import Carousel from '../Carousel';
import VideoPlayer from '../VideoPlayer';
import styles from './style';
import {Post} from '../../API';
import {Storage} from 'aws-amplify';

interface IContent {
  post: Post;
  isVisible: boolean;
  toggleLike: () => void;
}

export default function Content({post, isVisible, toggleLike}: IContent) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagesUrl, setImagesUrl] = useState<string[] | null>(null);
  const [videoUrl, setVidoeUrl] = useState<string | null>(null);

  useEffect(() => {
    downloadMedia();
  }, []);

  const downloadMedia = async () => {
    if (post.image) {
      const uri = await Storage.get(post.image);
      setImageUrl(uri);
    } else if (post.images) {
      const uris = await Promise.all(post.images.map(img => Storage.get(img)));
      setImagesUrl(uris);
    } else if (post.video) {
      const uri = await Storage.get(post.video);
      setVidoeUrl(uri);
    }
  };

  if (imageUrl) {
    return (
      <DoublePressable onDoublePress={toggleLike}>
        <Image
          source={{
            uri: imageUrl,
          }}
          style={styles.image}
        />
      </DoublePressable>
    );
  } else if (imagesUrl) {
    return <Carousel images={imagesUrl} onDoublePress={toggleLike} />;
  } else if (videoUrl) {
    return (
      <DoublePressable onDoublePress={toggleLike}>
        <VideoPlayer uri={videoUrl} paused={!isVisible} />
      </DoublePressable>
    );
  }
  return (
    <View>
      <ActivityIndicator />
    </View>
  );
}
