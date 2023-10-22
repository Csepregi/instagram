import {Image, Text, View} from 'react-native';
import styles from './styles';
import user from '../../assets/data/user.json';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';
import {ProfileNavigationProp} from '../../types/navigation';
import {useAuthenticator} from '@aws-amplify/ui-react-native';

const ProfileHeader = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const {signOut} = useAuthenticator();
  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        {/* Profile image */}
        <Image source={{uri: user.image}} style={styles.avatar} />
        {/* Posts, followers, following number */}
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>98</Text>
          <Text>Posts</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>98</Text>
          <Text>Posts</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>98</Text>
          <Text>Posts</Text>
        </View>
      </View>

      <Text style={styles.name}>{user.name}</Text>
      <Text>{user.bio}</Text>
      <View style={{flexDirection: 'row'}}>
        <Button
          text={'Edit Profile'}
          onPress={() => navigation.navigate('Edit Profile')}
        />
        <Button text={'SignOut'} onPress={signOut} />
        {/* or topToTop */}
      </View>
    </View>
  );
};

export default ProfileHeader;
