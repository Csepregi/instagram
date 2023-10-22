import {Amplify} from 'aws-amplify';
import {withAuthenticator} from '@aws-amplify/ui-react-native';
import config from './src/aws-exports';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import AuthContextProvider from './src/context/AuthContext';

Amplify.configure(config);

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </SafeAreaProvider>
  );
};

export default App;
