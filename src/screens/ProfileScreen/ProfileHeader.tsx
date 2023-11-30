import {Text, View} from 'react-native';
import styles from './styles';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';
import {ProfileNavigationProp} from '../../types/navigation';
import {
  useAuthenticator,
  withAuthenticator,
} from '@aws-amplify/ui-react-native';
import {User} from '../../API';
import {useAuthContext} from '../../context/AuthContext';
import UserImage from '../../components/UserImage';

interface IProfileHeader {
  user: User;
}

const ProfileHeader = ({user}: IProfileHeader) => {
  const {userId} = useAuthContext();
  const navigation = useNavigation<ProfileNavigationProp>();
  const {signOut} = useAuthenticator();
  navigation.setOptions({title: user?.username || 'Profile'});

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        {/* Profile image */}
        <UserImage imageKey={user.image} width={100} />
        {/* Posts, followers, following number */}
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{user.noPosts}</Text>
          <Text>Posts</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{user.noFollowers}</Text>
          <Text>Followers</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{user.noFollowings}</Text>
          <Text>Following</Text>
        </View>
      </View>

      <Text style={styles.name}>{user.name}</Text>
      <Text>{user.bio}</Text>
      {console.log('userId ', userId)}
      {console.log('user.id ', user.id)}
      {userId === user.id && (
        <View style={{flexDirection: 'row'}}>
          <Button
            text={'Edit Profile'}
            onPress={() => navigation.navigate('Edit Profile')}
            inline
          />
          <Button text={'SignOut'} onPress={signOut} inline />
          {/* or topToTop */}
        </View>
      )}
    </View>
  );
};

export default withAuthenticator(ProfileHeader);
