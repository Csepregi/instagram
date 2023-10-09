import {StyleSheet} from 'react-native';
import fonts from '../../theme/fonts';
import colors from '../../theme/colors';

const styles = StyleSheet.create({
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  bold: {
    fontWeight: fonts.weight.bold,
  },
  commentText: {
    color: colors.black,
    lineHeight: 18,
  },
  avatar: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 25,
    marginRight: 5,
  },
  middleColumn: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
  },
  footerText: {
    marginRight: 10,
  },
});

export default styles;
