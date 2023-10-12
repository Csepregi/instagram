import {View, Text, StyleSheet, Linking, Pressable} from 'react-native';
import {
  Camera,
  CameraDevice,
  useCameraDevice,
  TakePhotoOptions,
  useCameraDevices,
  useCameraPermission,
  useMicrophonePermission,
  useCameraFormat,
} from 'react-native-vision-camera';
import {useSharedValue} from 'react-native-reanimated';
import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import {SCREEN_HEIGHT, SCREEN_WIDTH, MAX_ZOOM_FACTOR} from '../../constants';
import colors from '../../theme/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PostUploadScreen = () => {
  // const devices = Camera.getAvailableCameraDevices();
  // const device = devices.find(d => d.position === 'back');
  //const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  //const [cameraType, setCameraType] = useState(Camera.Con);
  const [loading, setLoading] = useState(null);
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  //let value = false;
  //const isPressingButton = useSharedValue<boolean | undefined>(value);

  // const zoom = useSharedValue(0);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const device = useCameraDevice(cameraPosition);

  const camera = useRef<Camera>(null);

  const cameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setLoading(device);
  }, [device]);

  useEffect(() => {
    cameraPermission();
  }, [cameraPermission, device]);

  const onChangeCamera = () =>
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));

  const onFlashPressed = useCallback(() => {
    setFlash(f => (f === 'off' ? 'on' : 'off'));
  }, []);

  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;

  const [targetFps, setTargetFps] = useState(60);
  const format = useCameraFormat(device, [
    {fps: targetFps},
    {videoAspectRatio: screenAspectRatio},
    {videoResolution: 'max'},
    {photoAspectRatio: screenAspectRatio},
    {photoResolution: 'max'},
  ]);

  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  // const cameraAnimatedProps = useAnimatedProps(() => {
  //   const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
  //   return {
  //     zoom: z,
  //   };
  // }, [maxZoom, minZoom, zoom]);

  const takePhotoOptions = useMemo<TakePhotoOptions>(
    () => ({
      photoCodec: 'jpeg',
      qualityPrioritization: 'speed',
      flash: flash,
      quality: 90,
      enableShutterSound: false,
    }),
    [flash],
  );

  const takePicture = useCallback(async () => {
    try {
      if (camera.current == null) {
        throw new Error('Camera ref is null!');
      }
      const photo = await camera.current.takePhoto(takePhotoOptions);
      console.log('Taking photo...', photo);
      // onMediaCaptured(photo, 'photo')
    } catch (e) {
      console.error('Failed to take photo!', e);
    }
  }, [camera, takePhotoOptions]);

  // const setIsPressingButton = useCallback(
  //   (_isPressingButton: boolean) => {
  //     isPressingButton.value = _isPressingButton;
  //   },
  //   [isPressingButton],
  // );

  // const onDoubleTap = useCallback(() => {
  //   onFlipCameraPressed()
  // }, [onFlipCameraPressed])

  // useEffect(() => {
  //   const getPermission = async () => {
  //     const cameraPermission = await Camera.getCameraPermissionStatus();
  //     const microphonePermission = await Camera.getMicrophonePermissionStatus();
  //     setHasPermission(
  //       cameraPermission === 'granted' && microphonePermission === 'granted',
  //     );
  //   };
  //   getPermission();
  // }, []);

  // if (hasPermission === null) {
  //   return <Text>Loading...</Text>;
  // }
  // if (hasPermission === false) {
  //   return <Text>No access to the camera</Text>;
  // }
  // if (device == null) {
  //   return <Text>No devices</Text>;
  // }
  return (
    <View style={styles.page}>
      <Camera
        style={styles.camara}
        ref={camera}
        device={device}
        isActive={true}
        photo={true}
        video={true}
        //setIsPressingButton={setIsPressingButton}
        //animatedProps={cameraAnimatedProps}
      />
      <View style={[styles.buttonContainer, {top: 10}]}>
        <MaterialIcons name="close" size={30} color={colors.white} />
        <Pressable onPress={onFlashPressed}>
          <MaterialIcons
            name={flash === 'on' ? 'flash-on' : 'flash-off'}
            size={30}
            color={colors.white}
          />
        </Pressable>
        <MaterialIcons name="settings" size={30} color={colors.white} />
      </View>
      <View style={[styles.buttonContainer, {bottom: 25}]}>
        <MaterialIcons name="photo-library" size={30} color={colors.white} />
        <Pressable onPress={takePicture}>
          <View style={styles.circle} />
        </Pressable>
        <Pressable onPress={onChangeCamera}>
          <MaterialIcons
            name="flip-camera-ios"
            size={30}
            color={colors.white}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  camara: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
  },
  circle: {
    width: 75,
    aspectRatio: 1,
    borderRadius: 75,
    backgroundColor: colors.white,
  },
});

export default PostUploadScreen;
