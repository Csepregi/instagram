import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import CommentsScreen from '../screens/CommentsScreen';
import {RootNavigator} from '../types/navigation';
import AuthStackNavigator from './AuthStackNavigator';
import { useAuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootNavigator>();

const linking: LinkingOptions<RootNavigator> = {
  prefixes: ['notjustphotos://', 'https://notjustphotos.com'],
  config: {
    initialRouteName: 'Home',
    screens: {
      Comments: 'comments', // notjustphotos:// comments
      // // notjustphotos:// user/123
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
  const {user} = useAuthContext()
  
  if (user === undefined) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    )
  }
  return (
    <View style={styles.app}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          initialRouteName="Auth"
          screenOptions={{headerShown: true}}>
          {!user ? (
            <Stack.Screen
            name="Auth"
            component={AuthStackNavigator}
            options={{headerShown: false}}
          />
          ) : (
            <>
            <Stack.Screen
                name="Home"
                component={BottomTabNavigator}
                options={{ headerShown: false }} />
            <Stack.Screen name="Comments" component={CommentsScreen} />
            </>
          )}
          
         
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
