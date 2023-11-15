import {Amplify} from 'aws-amplify';
import {withAuthenticator} from '@aws-amplify/ui-react-native';
import config from './src/aws-exports';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import AuthContextProvider from './src/context/AuthContext';
import Client from './src/apollo/Client';

Amplify.configure(config);

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <Client>
        <Navigation />
        </Client>
      </AuthContextProvider>
    </SafeAreaProvider>
  );
};

export default App;
