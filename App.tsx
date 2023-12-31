import 'react-native-get-random-values';
import {Amplify} from 'aws-amplify';
import {withAuthenticator} from '@aws-amplify/ui-react-native';
import config from './src/aws-exports';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import AuthContextProvider from './src/context/AuthContext';
import Client from './src/apollo/Client';
import {MenuProvider} from 'react-native-popup-menu';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as dayjs from 'dayjs';

dayjs.extend(relativeTime);

Amplify.configure(config);

const App = () => {
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <AuthContextProvider>
          <Client>
            <Navigation />
          </Client>
        </AuthContextProvider>
      </MenuProvider>
    </SafeAreaProvider>
  );
};

export default App;
