import {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';

interface IVideoPlayer {
  uri: string;
  paused: boolean;
}

export default function VideoPlayer({uri, paused}: IVideoPlayer) {
  const [muted, setMuted] = useState(true);
  return (
    <View>
      <Video
        source={{uri}}
        style={styles.video}
        resizeMode="cover"
        repeat
        muted={muted}
        paused={paused}
      />
      <Pressable onPress={() => setMuted(v => !v)} style={styles.muteButton}>
        <Ionicons
          name={muted ? 'volume-mute' : 'volume-medium'}
          size={14}
          color="white"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    aspectRatio: 1,
  },
  muteButton: {
    backgroundColor: colors.black,
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 5,
    borderRadius: 25,
  },
});
