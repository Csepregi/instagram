import {Amplify} from 'aws-amplify';
import {withAuthenticator} from '@aws-amplify/ui-react-native';
import config from './src/aws-exports';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from './src/navigation';

Amplify.configure(config);

const App = () => {
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
};

export default App;
