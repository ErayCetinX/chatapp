import { View } from 'react-native';
import React from 'react';
import style from './TabBarStyle';
import { Button, Icons, Text } from '../../ui';
import { useSelector } from 'react-redux';
import { getLoggedInUserDetailsType, State } from '../../../types';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';

const getGreetingMessage = (): string => {
  const currentDate: Date = new Date();
  const currentHour: number = currentDate.getHours();

  let greetingMessage: string = '';

  if (currentHour >= 6 && currentHour < 12) {
    greetingMessage = 'Good Morning!';
  } else if (currentHour >= 12 && currentHour < 18) {
    greetingMessage = 'Good Afternoon!';
  } else {
    greetingMessage = 'Good Evening!';
  }

  return greetingMessage;
};

const Tabbar = () => {
  const navigation = useNavigation();

  const activeUser = useSelector<State, getLoggedInUserDetailsType>(
    state => state.getLoggedInUserDetails,
  );

  return (
    <View style={style.container}>
      <View style={style.box}>
        <View style={style.userInfo}>
          <Button
            onPress={() => navigation.navigate('Profile')}
            style={style.userImage}>
            <FastImage
              source={{
                uri: activeUser.avatarUrl,
                priority: FastImage.priority.normal,
              }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          </Button>
          <View>
            <Text style={style.time} text={getGreetingMessage()} />
            <Text style={style.username} text={activeUser.username} />
          </View>
        </View>
        <View style={style.Icons}>
          <View
            style={[
              style.IconsItem,
              { backgroundColor: '#427DFF', borderRadius: 99 },
            ]}>
            <Button
              onPress={() => navigation.navigate('CreateInbox')}
              style={{ paddingHorizontal: 8, paddingVertical: 8 }}>
              <Icons name="plus" type="feather" color="#fff" />
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Tabbar;
