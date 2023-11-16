import {View, Text, StyleSheet, Image, TextInput, ActivityIndicator, Alert} from 'react-native';
import {useEffect, useState} from 'react';
import {useForm, Control, Controller} from 'react-hook-form';
import {Asset, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import colors from '../../theme/colors';
import fonts from '../../theme/fonts';
import { DeleteUserMutation, DeleteUserMutationVariables, GetUserQuery, GetUserQueryVariables, UpdateUserMutation, UpdateUserMutationVariables, User } from '../../API';
import {getUser, updateUser, deleteUser} from './queries'
import { useMutation, useQuery } from '@apollo/client';
import { useAuthContext } from '../../context/AuthContext';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import { useNavigation } from '@react-navigation/native';
import { Auth } from 'aws-amplify';

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

type IEditableUserField = 'name' | 'username' | 'website' | 'bio';
type IEditableUser = Pick<User, IEditableUserField>;
interface ICustomInput {
  control: Control<IEditableUser, object>;
  label: string;
  name: IEditableUserField;
  multiline?: boolean;
  rules?: object;
}

const CustomInput = ({
  control,
  label,
  name,
  multiline = false,
  rules = {},
}: ICustomInput) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({field: {onChange, value, onBlur}, fieldState: {error}}) => {
      return (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{label}</Text>
          <View style={{flex: 1}}>
            <TextInput
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Hello"
              style={[
                styles.input,
                {borderColor: error ? colors.error : colors.border},
              ]}
              multiline={multiline}
            />
            {error && (
              <Text style={{color: colors.error}}>
                {error.message || 'Error'}
              </Text>
            )}
          </View>
        </View>
      );
    }}
  />
);

const EditProfileScreen = () => {

  const {
    control,
    handleSubmit,
    setValue
  } = useForm<IEditableUser>();
  const navigation = useNavigation();
  const {userId, user: authUser} = useAuthContext();
  const {data, loading, error} = useQuery<GetUserQuery, GetUserQueryVariables>(getUser, {variables: {id: userId}});
  const user = data?.getUser;

  const [doUpdateUser, {loading: updateLoading, error: updateError}] = useMutation<UpdateUserMutation, UpdateUserMutationVariables>(updateUser)
  const [doDelete, {loading: deleteLoading, error: deleteError}] = useMutation<DeleteUserMutation, DeleteUserMutationVariables>(updateUser)

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('username', user.username);
      setValue('bio', user.bio);
      setValue('website', user.website);
    }
  }, [user, setValue])

  const [selectedPhoto, setSelectedPhoto] = useState<null | Asset>(null);

  const onSubmit = async (formData: IEditableUser) => {
    await doUpdateUser({variables: {input: {id: userId, ...formData}}})
    navigation.goBack();
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

    // delete from DB
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

  if (loading) {
    return <ActivityIndicator />
  }

  if (error || updateError || deleteError) {
    return <ApiErrorMessage title='Error fetching the user or updating the user' message={error?.message || updateError?.message || deleteError?.message} />
  }

  return (
    <View style={styles.page}>
      <Image
        source={{uri: selectedPhoto?.uri || user.image}}
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
        rules={{minLength: {value: 3}}}
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

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    padding: 10,
    paddingVertical: 10,
  },
  avatar: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  textButton: {
    color: colors.primary,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semi,
    margin: 10,
  },
  textButtonDanger: {
    color: colors.error,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semi,
    margin: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  label: {
    width: 75,
  },
  input: {
    borderColor: colors.border,
    borderBottomWidth: 1,
    minHeight: 50
  },
});

export default EditProfileScreen;
