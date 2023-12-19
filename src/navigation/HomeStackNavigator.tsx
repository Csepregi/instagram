import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import {Image} from 'react-native';
import logo from '../assets/images/csep.png';
import {RootNavigatorParamList} from '../types/navigation';
import UpdatePostScreen from '../screens/UpdatePostScreen';
import PostLikesScreen from '../screens/PostLikesScreen';
import ProfileStackNavigator from './ProfileStackNavigator';

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={HomeScreen}
        options={{headerTitle: HeaderTitle, headerTitleAlign: 'center'}}
      />
      <Stack.Screen
        name="UserProfile"
        component={ProfileStackNavigator}
        options={{title: 'Profile'}}
      />
      <Stack.Screen
        name="UpdatePost"
        component={UpdatePostScreen}
        options={{title: 'Update Post'}}
      />
      <Stack.Screen
        name="PostLikes"
        component={PostLikesScreen}
        options={{title: 'Post Likes'}}
      />
    </Stack.Navigator>
  );
};

const HeaderTitle = () => {
  return (
    <Image
      source={logo}
      resizeMode="cover"
      style={{width: 150, height: 50, alignContent: 'center'}}
    />
  );
};

export default HomeStackNavigator;
