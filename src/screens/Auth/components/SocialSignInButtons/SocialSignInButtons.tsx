import React from 'react';
import CustomButton from '../CustomButton';
import {Auth} from 'aws-amplify';
import {Alert} from 'react-native';
import {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth';

const SocialSignInButtons = () => {
  const onSignInFacebook = async () => {
    try {
      await Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Facebook})
    } catch (error) {
      Alert.alert('Ops', (error as Error).message);
    }
  };

  const onSignInGoogle = async () => {
    try {
      await Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google})
    } catch (error) {
      Alert.alert('Ops', (error as Error).message);
    }
  };

  return (
    <>
      <CustomButton
        text="Sign In with Facebook"
        onPress={onSignInFacebook}
        bgColor="#E7EAF4"
        fgColor="#4765A9"
      />
      <CustomButton
        text="Sign In with Google"
        onPress={onSignInGoogle}
        bgColor="#FAE9EA"
        fgColor="#DD4D44"
      />
    </>
  );
};

export default SocialSignInButtons;
