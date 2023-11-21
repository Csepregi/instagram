import {View, Text, Image,  ActivityIndicator, Alert} from 'react-native';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Asset, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { DeleteUserMutation, DeleteUserMutationVariables, GetUserQuery, GetUserQueryVariables, UpdateUserMutation, UpdateUserMutationVariables, User, UsersByUsernameQuery, UsersByUsernameQueryVariables } from '../../API';
import {getUser, updateUser, deleteUser, usersByUsername} from './queries'
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { useAuthContext } from '../../context/AuthContext';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import { useNavigation } from '@react-navigation/native';
import { Auth } from 'aws-amplify';
import {styles} from './styles'
import CustomInput, {IEditableUser} from './CustomInput';
import { DEFAULT_USER_IMAGE } from '../../config';

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const EditProfileScreen = () => {

  const {
    control,
    handleSubmit,
    setValue
  } = useForm<IEditableUser>();
  const navigation = useNavigation();
  const {userId, user: authUser} = useAuthContext();
  console.log('EDIT PROFILE userId ', userId)
  const {data, loading, error} = useQuery<GetUserQuery, GetUserQueryVariables>(getUser, {variables: {id: userId}})

  console.log('EDIT PROFILE data ', data)
  const user = data?.getUser;
  //console.log('EDIT PROFILE USER ', user)
  const [getUsersByUsername] = useLazyQuery<UsersByUsernameQuery, UsersByUsernameQueryVariables>(usersByUsername);

  const [doUpdateUser, {loading: updateLoading, error: updateError}] = useMutation<UpdateUserMutation, UpdateUserMutationVariables>(updateUser)
  const [doDelete, {loading: deleteLoading, error: deleteError}] = useMutation<DeleteUserMutation, DeleteUserMutationVariables>(deleteUser)



  const [selectedPhoto, setSelectedPhoto] = useState<null | Asset>(null);

  const onSubmit = async (formData: IEditableUser) => {
    await doUpdateUser({variables: {input: {id: userId, ...formData}}})
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const confirmDelete = () => {
    Alert.alert('Are you sure?', 'Deleting your user profile is permanent', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Yes, delete',
        style: 'destructive',
        onPress: startDeleting
      }
    ])
  }

  const startDeleting = async () => {
    if (!user) {
      return
    }

  //   // delete from DB
    await doDelete({variables: {input: {id: userId}}})
    //delete from Cognito
    authUser?.deleteUser(err => {
      if (err) {
        console.log(err)
      }
      Auth.signOut()
    })
  };

  

  const onChangePhoto = () => {
    launchImageLibrary(
      {mediaType: 'photo'},
      ({didCancel, errorCode, assets}) => {
        if (!didCancel && !errorCode && assets && assets.length > 0) {
          setSelectedPhoto(assets[0]);
        }
      },
    );
  };

  const validateUserName = async (username: string) => {
    // query the databases based on the userByUsername
    try {
      const response = await getUsersByUsername({variables: {username}})
      if (response.error) {
        Alert.alert('Failed to fetch username')
        return 'Failed to fetch username'
      }
      const users = response.data?.usersByUsername?.items;
      if (users && users?.length > 0 && users?.[0]?.id !== userId) {
        return 'Username is already taken'
      }
    } catch (error) {
      Alert.alert('Failed to fetch username')
    }
    
    // if there are any users with this username, then return the error
    return true
  }

  if (loading) {
    return <ActivityIndicator />
  }

  if (error || updateError || deleteError) {
    return <ApiErrorMessage title='Error fetching the user or updating the user' message={error?.message || updateError?.message || deleteError?.message} />
  }
  if (error ) {
    return <ApiErrorMessage title='Error fetching the user or updating the user' message={error?.message} />
  }

  return (
    <View style={styles.page}>
       <Image
        //source={{uri: selectedPhoto?.uri || user?.image || DEFAULT_USER_IMAGE}}
        source={{uri:  DEFAULT_USER_IMAGE}}
        style={styles.avatar}
      />
      <Text onPress={onChangePhoto} style={styles.textButton}>
        Change profile photo
      </Text>
      <CustomInput
        name="name"
        control={control}
       // rules={{required: true, minLength: {value: 3}}}
        label="Name"
      />
      <CustomInput
        name="username"
        control={control}
        rules={{
          validate: validateUserName 
        }}
        label="Username"
      />
      <CustomInput
        name="website"
        control={control}
        
        rules={{
          pattern: {value: URL_REGEX, message: 'Invalid url'},
        }}
        label="Website"
      />
      <CustomInput name="bio" control={control} rules={{maxLength: {
        value: 200, message: 'Bio should be less then 200 character'
      }}} label="Bio" multiline />
      <Text onPress={handleSubmit(onSubmit)} style={styles.textButton}>
        {updateLoading ? 'Submitting' : 'Submit'}
      </Text>
      <Text onPress={confirmDelete} style={styles.textButtonDanger}>
        {deleteLoading ? 'Deleting' : 'Delete user'}
      </Text> 
    </View>
  );
};



export default EditProfileScreen;
