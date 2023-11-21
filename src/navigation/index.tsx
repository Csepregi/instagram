import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import CommentsScreen from '../screens/CommentsScreen';
import {RootNavigator} from '../types/navigation';
import AuthStackNavigator from './AuthStackNavigator';
import { useAuthContext } from '../context/AuthContext';
import { useQuery } from '@apollo/client';
import { GetUserQuery, GetUserQueryVariables } from '../API';
import { getUser } from './queries';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator<RootNavigator>();

const linking: LinkingOptions<RootNavigator> = {
  prefixes: ['csepregisphotos://', 'https://csepregisphotos.com'],
  config: {
    initialRouteName: 'Home',
    screens: {
      Comments: 'comments', // csepregisphotos:// comments
      // // csepregisphotos:// user/123
      Home: {
        screens: {
          HomeStack: {
            initialRouteName: 'Feed',
            screens: {
              UserProfile: 'user/:userId',
            },
          },
        },
      },
    },
  },
};

const Navigation = () => {
  const {user, userId} = useAuthContext()
  const {data, loading, error} = useQuery<GetUserQuery, GetUserQueryVariables>(getUser, {variables: {id: userId}});
  console.log('DATA NAVIGATION, ', data)
  const userData = data?.getUser
  console.log('DATA userData, ', userData)
  if (user === undefined || loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    )
  }

  let stackScreens = null;
  if (!user) {
    stackScreens = (
      <Stack.Screen
        name="Auth"
        component={AuthStackNavigator}
        options={{headerShown: false}}
    />
    );
  }
  else if (!userData?.username) {
    stackScreens = (
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{title: 'Setup Profile'}}
      />
    );
  }
    else {
      stackScreens = (
        <>
        <Stack.Screen
            name="Home"
            component={BottomTabNavigator}
            options={{ headerShown: false }} />
        <Stack.Screen name="Comments" component={CommentsScreen} />
      </>
      );
    }

  return (
    <View style={styles.app}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator screenOptions={{headerShown: true}}>
         {stackScreens}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});

export default Navigation;
