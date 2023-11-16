import {Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../theme/colors';
import fonts from '../../theme/fonts';

interface IButton {
  text?: string;
  onPress?: () => void;
  inline?: boolean;
}

export default function Button({text = '', onPress = () => {}, inline = false}: IButton) {
  return (
    <Pressable onPress={onPress} style={[styles.container, inline ? {flex: 1} : {}]}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 5,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: colors.black,
    fontWeight: fonts.weight.semi,
  },
});
