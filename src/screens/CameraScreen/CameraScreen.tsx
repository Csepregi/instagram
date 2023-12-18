import {
  View,
  Text,
  StyleSheet,
  Linking,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  CameraDevice,
  useCameraDevice,
  TakePhotoOptions,
  useCameraDevices,
  useCameraPermission,
  useMicrophonePermission,
  useCameraFormat,
  PhotoFile,
  VideoFile,
} from 'react-native-vision-camera';
import {useSharedValue} from 'react-native-reanimated';
import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import {SCREEN_HEIGHT, SCREEN_WIDTH, MAX_ZOOM_FACTOR} from '../../constants';
import colors from '../../theme/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {CameraNavigationProp} from '../../types/navigation';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CameraScreen = () => {
  const navigation = useNavigation<CameraNavigationProp>();

  const {hasPermission, requestPermission} = useCameraPermission();
  const {
    hasPermission: microphonePerimission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();
  const [photo, setPhoto] = useState<PhotoFile>();
  const [video, setVideo] = useState<VideoFile>();
  const [loading, setLoading] = useState(null);

  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const inset = useSafeAreaInsets();
  //let value = false;
  //const isPressingButton = useSharedValue<boolean | undefined>(value);

  // const zoom = useSharedValue(0);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const device = useCameraDevice(cameraPosition);

  const camera = useRef<Camera>(null);

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => {
        setIsActive(false);
      };
    }, []),
  );

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
    if (!microphonePerimission) {
      requestPermission();
    }
  }, [hasPermission, microphonePerimission]);

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

  // const takePicture = useCallback(async () => {
  //   if (isRecording) {
  //     camera.current?.stopRecording();
  //     return;
  //   }
  //   try {
  //     if (camera.current == null) {
  //       throw new Error('Camera ref is null!');
  //     }
  //     const photo = await camera.current.takePhoto(takePhotoOptions);
  //     console.log('Taking photo...', photo);
  //     navigation.navigate('Create', {
  //       image: photo.path,
  //     });
  //     // onMediaCaptured(photo, 'photo')
  //   } catch (e) {
  //     console.error('Failed to take photo!', e);
  //   }
  // }, [camera, takePhotoOptions]);

  const takePicture = async () => {
    if (isRecording) {
      camera.current?.stopRecording();
      return;
    }
    try {
      if (camera.current == null) {
        throw new Error('Camera ref is null!');
      }
      const photo = await camera.current.takePhoto(takePhotoOptions);
      console.log('Taking photo...', photo);
      navigation.navigate('Create', {
        image: photo.path,
      });
      // onMediaCaptured(photo, 'photo')
    } catch (e) {
      console.error('Failed to take photo!', e);
    }
  };

  const onStartRecording = async () => {
    console.warn('recording');
    if (!camera.current) {
      return;
    }
    setIsRecording(true);
    camera.current.startRecording({
      onRecordingFinished: video => {
        console.log('Video', video);
        setIsRecording(false);
        setVideo(video);
        navigation.navigate('Create', {
          video: video.path,
        });
      },
      onRecordingError: error => setIsRecording(false),
    });
  };

  const openImageGallery = () => {
    launchImageLibrary(
      {mediaType: 'mixed', selectionLimit: 3},
      ({didCancel, errorCode, assets}) => {
        if (!didCancel && !errorCode && assets && assets.length > 0) {
          const params: {image?: string; images?: string[]; video?: string} =
            {};
          if (assets.length === 1) {
            const field = assets[0].type?.startsWith('video')
              ? 'video'
              : 'image';
            params[field] = assets[0].uri;
          } else if (assets.length > 1) {
            params.images = assets?.map(asset => asset.uri) as string[];
          }
          navigation.navigate('Create', params);
        }
      },
    );
  };

  // if (!hasPermission || !microphonePerimission) {
  //   return <ActivityIndicator />;
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
        isActive={isActive && !photo}
        photo
        video
        audio
        //setIsPressingButton={setIsPressingButton}
        //animatedProps={cameraAnimatedProps}
      />
      <View style={[styles.buttonContainer, {top: inset.top + 25}]}>
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
        <Pressable onPress={openImageGallery}>
          <MaterialIcons name="photo-library" size={30} color={colors.white} />
        </Pressable>
        <Pressable onPress={takePicture} onLongPress={onStartRecording}>
          <View
            style={[
              styles.circle,
              {backgroundColor: isRecording ? colors.error : colors.white},
            ]}
          />
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
    aspectRatio: 1 / 2,
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
  },
});

export default CameraScreen;
