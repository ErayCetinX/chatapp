import React, { useEffect } from 'react';
import 'react-native-gesture-handler';

import { useQuery } from '@apollo/client';
import Index from './src/navigation';
import { useDispatch } from 'react-redux';
import { loginUser } from './src/redux/userSlice';
import { ActivityIndicator, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLoggedInUserDetailsQuery } from './src/request/query';
// import Icons from './src/assets/ic_launcher.png';
// import messaging from '@react-native-firebase/messaging';
// import firebase from '@react-native-firebase/app';
// import PushNotification, { Importance } from 'react-native-push-notification';

const App = () => {
  const { data, loading,refetch } = useQuery(getLoggedInUserDetailsQuery);
  const dispatch = useDispatch();
  useEffect(() => {
    const Appcheck = async () => {
      const IsThemeExist = await AsyncStorage.getItem('Theme');
      if (
        IsThemeExist === undefined ||
        IsThemeExist === null ||
        IsThemeExist === ''
      ) {
        await AsyncStorage.setItem('Theme', 'Light');
      }
    };
    Appcheck();
    dispatch(loginUser(data?.getLoggedInUserDetails.user));
  }, [data?.getLoggedInUserDetails.user , dispatch]);


  // const ShowNoti = (channelId, options) => {
  //   PushNotification.localNotification({
  //     channelId: channelId, // (required) channelId, if the channel doesn't exist, notification will not trigger.
  //     largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
  //     smallIcon: 'ic_launcher', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
  //     // bigPictureUrl: options.bigImage, // (optional) default: undefined
  //     // bigLargeIconUrl: "https://cdn0.iconfinder.com/data/icons/logos-brands-in-colors/128/react-128.png", // (optional) default: undefined
  //     // color: 'red', // (optional) default: system default
  //     vibrate: true, // (optional) default: true
  //     vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  //     priority: 'high', // (optional) set notification priority, default: high

  //     title: options.title, // (optional)
  //     message: options.message, // (required)
  //   });
  // };

  // const CreateChannel = channelId => {
  //   PushNotification.createChannel({
  //     channelId, // (required)
  //     channelName: 'WhoollyChannel', // (required)
  //     channelDescription: 'WhoollyMessage', // (optional) default: undefined.
  //     playSound: false, // (optional) default: true
  //     soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
  //     importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
  //     vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  //   });
  // };

  // useEffect(() => {
  //   firebase
  //     .app()
  //     .messaging()
  //     .getToken()
  //     .then(token => {
  //       dispatch(Device(token));
  //     });

  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     CreateChannel(UserId);
  //     ShowNoti(UserId, {
  //       title: remoteMessage.notification.title,
  //       message: remoteMessage.notification.body,
  //     });
  //   });

  //   return unsubscribe;
  // }, [UserId, dispatch]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color={'#000'} size={25} />
        </View>
      </View>
    );
  }

  return <Index refetch={refetch} />;
};

export default App;
