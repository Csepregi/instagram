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
import { useEffect, useState } from 'react';
import { Storage } from 'aws-amplify';
import { DEFAULT_USER_IMAGE } from '../../config';

interface IProfileHeader {
  user: User;
}

const ProfileHeader = ({user}: IProfileHeader) => {
  const {userId} = useAuthContext();
  const navigation = useNavigation<ProfileNavigationProp>();
  const {signOut} = useAuthenticator();
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({title: user?.name || 'Profile'});
  }, [user?.name]);

  useEffect(() => {
    if (user.image) {
      Storage.get(user.image).then(setImageUri);
    }
  }, [user]);

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        {/* Profile image */}
        <UserImage imageKey={user.image || DEFAULT_USER_IMAGE} width={100} />
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
