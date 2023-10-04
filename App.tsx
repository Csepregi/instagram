import {View, Text} from 'react-native';
import colors from './src/theme/colors';
import fonts from './src/theme/fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';

const App = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: colors.primary, fontSize: fonts.size.xlg}}>Hello </Text>
      <AntDesign name="plus" size={50} />
    </View>
  );
};

export default App;
