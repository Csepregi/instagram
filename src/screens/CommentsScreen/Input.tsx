import React, {useState} from 'react';
import {View, Text, Image, TextInput, StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import fonts from '../../theme/fonts';

export default function Input() {
  const [newComment, setNewComment] = useState('new comment');

  const onPost = () => {
    console.warn('POsting');
    setNewComment('');
  };

  return (
    <View style={styles.root}>
      <Image
        source={{
          uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/1.jpg',
        }}
        style={styles.image}
      />
      <TextInput
        value={newComment}
        placeholder="write your comment"
        style={styles.input}
        onChangeText={setNewComment}
        multiline
      />
      <Text onPress={onPost} style={styles.button}>
        POST
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    padding: 5,
    borderTopWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-end',
  },
  image: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 5,
    paddingRight: 50,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  button: {
    position: 'absolute',
    right: 15,
    bottom: 17,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.full,
    color: colors.primary,
  },
});
