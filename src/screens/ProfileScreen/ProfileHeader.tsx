import {FlatList, Image, Text, View} from 'react-native';
import styles from './styles';
import user from '../../assets/data/user.json';
import Button from '../../components/Button';

const ProfileHeader = () => {
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
          onPress={() => console.warn('edit profile')}
        />
        <Button
          text={'Edit Profile'}
          onPress={() => console.warn('edit profile')}
        />
      </View>
    </View>
  );
};

export default ProfileHeader;
