import {View, StyleSheet} from 'react-native';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import CommentsScreen from './src/screens/CommentsScreen';
import ProfileScreen from './src/screens/ProfileScreen/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen/EditProfileScreen';
import PostUploadScreen from './src/screens/PostUploadScreen';

const App = () => {
  return (
    <View style={styles.app}>
      {/* <HomeScreen /> */}
      {/* <ProfileScreen /> */}
      {/* <EditProfileScreen /> */}
      <PostUploadScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});

export default App;
