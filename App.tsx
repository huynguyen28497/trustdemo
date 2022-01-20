/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  NativeEventEmitter,
  Image,
  Alert,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Exif from 'react-native-exif';
import RNTrustVisionRnsdkFramework, {
  TVConst,
  TVErrorCode,
} from 'react-native-trust-vision-SDK';
import RNFS from 'react-native-fs';
import Mock from './src/Mock';

const App = () => {
  const [imageState, setImageState] = React.useState('');
  const [imageRaw, setImageRaw] = React.useState('');
  const onSessionConnect = (event: any) => {
    console.log(event);
  };

  // DeviceEventEmitter.addListener('TVSDKEvent', onSessionConnect);

  const onPress = async () => {
    try {
      // id capturing
      const cardType = {
        id: 'card_id',
        name: 'card_name',
        orientation: TVConst.Orientation.LANDSCAPE,
        hasBackSide: true,
      };
      const idConfig = {
        cardType: cardType,
        cardSide: TVConst.CardSide.FRONT,
        isEnableSound: false,
        isReadBothSide: true,
        isEnablePhotoGalleryPicker: false,
      };
      console.log('Id Config', idConfig);
      const result = await RNTrustVisionRnsdkFramework.startIdCapturing(
        idConfig,
      );
      // console.log('Id Result', result);
      setImageState(
        `data:image/jpeg;base64,${result?.idBackImage?.raw_image_base64}`,
      );
      setImageRaw(`${result?.idBackImage?.raw_image_base64}`);
      //  console.log("TVSDK - init")
      //  const clientSettingJsonString = "{\"settings\":{\"sdk_settings\":{\"active_liveness_settings\":{\"face_tracking_setting\":{\"android_terminate_threshold\":0.002847,\"android_warning_threshold\":0.001474,\"enable\":true,\"ios_terminate_threshold\":0.003393,\"ios_warning_threshold\":0.002176,\"limit_for\":\"all_flow\",\"max_warning_time\":5},\"flow_interval_time_ms\":1500,\"limit_time_liveness_check\":{\"enable\":true,\"limit_time_second\":15},\"record_video\":{\"enable\":false},\"save_encoded_frames\":{\"enable\":true,\"frames_interval_ms\":120},\"terminate_if_no_face\":{\"enable\":true,\"max_invalid_frame\":5,\"max_time_ms\":1000}},\"id_detection_settings\":{\"scan_qr_settings\":{\"enable\":false,\"limit_time_second\":10}, \"save_frame_settings\":{\"enable\":true,\"frames_interval_ms\":190}, \"limit_time_settings\":{\"enable\":true,\"limit_time_second\":20}, \"flow_interval_time_ms\": 2000, \"auto_capture\":{\"enable\":false,\"show_capture_button\":true},\"blur_check\":{\"enable\":true,\"threshold\":0.29},\"disable_capture_button_if_alert\":true,\"glare_check\":{\"enable\":true,\"threshold\":0.001},\"id_detection\":{\"enable\":true}},\"liveness_settings\":{\"vertical_check\":{\"enable\":true,\"threshold\":40}}}}}"
      //  await RNTrustVisionRnsdkFramework.initialize(
      //    clientSettingJsonString,
      //    'vi',
      //    true
      //  );

      //  console.log("TVSDK - events listener")
      //  const tvsdkEmitter = new NativeEventEmitter(RNTrustVisionRnsdkFramework);
      //  const subscription = tvsdkEmitter.addListener('TVSDKEvent',(event) => {
      //      console.log("TVSDK - " + event.name + " - " + event.params.page_name)
      //  });

      //  // console.log("TVSDK - start id capturing")
      //  // // id capturing
      //  const info = await RNTrustVisionRnsdkFramework.getInfo();
      //  console.log("info", info);

      //  console.log("TVSDK - start selfie capturing")
      //  // selfie capturing
      //  const selfieConfig = {
      //    cameraOption: TVConst.SelfieCameraMode.FRONT,
      //    livenessMode: TVConst.LivenessMode.ACTIVE,
      //    isEnableSound: true,
      //    skipConfirmScreen: true
      //  };

      // const theme = {
      //   ctaBackgroundColor: "#2E68FF",
      //   ctaTextColor: ""
      // };
      //  console.log('Selfie Config', selfieConfig);
      //  const selfieResult = await RNTrustVisionRnsdkFramework.startSelfieCapturing(
      //    selfieConfig,
      //    theme
      //  );
      //  console.log('Selfie Result', selfieResult);
    } catch (e: any) {
      console.log('Error: ', e.code, ' - ', e.message);
    }
  };

  useEffect(() => {
    if (imageState.length > 0) {
      const fileSizeKB = Math.ceil(
        (4 * Math.ceil(+imageState.length / 3) * 0.5624896334383812) / 1000,
      );
      Image.getSize(imageState, (w, h) => {
        Alert.alert(
          'Screenshoot',
          `width: ${w}, height: ${h}, size: ${fileSizeKB}`,
        );
      });

      const file_path = RNFS.DownloadDirectoryPath + `/image_${Date.now()}.jpg`;
      RNFS.writeFile(file_path, imageRaw, 'base64')
        .then(res => {
          RNFS.getFSInfo();

          Exif.getExif(file_path)
            .then((msg: any) => console.warn('OK: ' + JSON.stringify(msg)))
            .catch((msg: any) => console.warn('ERROR: ' + msg));
        })
        .catch(err => {
          console.log(err.message);
        });
      // Exif.getExif(imageState)
      //   .then((msg: any) => console.warn('OK: ' + JSON.stringify(msg)))
      //   .catch((msg: any) => console.warn('ERROR: ' + msg));
    }
  }, [imageState]);

  useEffect(() => {
    console.log('🚀 ~ file: App.tsx ~ line 130 ~ useEffect ~ PixelRatio');
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Button title={'Press Me'} onPress={onPress} />
        {/* {imageState ? (
          <Image
            style={{
              width: 869,
              height: 586,
            }}
            source={{
              uri: imageState,
            }}
          />
        ) : null} */}
        <Mock />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
