import {TextStyle} from 'react-native';

const size = {
  xs: 10,
  default: 14,
  small: 12,
  md: 16,
  lg: 20,
  xlg: 24,
  xxlg: 30,
};

const weight: {[key: string]: TextStyle['fontWeight']} = {
  full: '900',
  bold: 'bold',
  normal: 'normal',
  semi: '600',
  thin: '400',
};

export default {size, weight};
