import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Button, Icons } from '../../ui';
import { useNavigation } from '@react-navigation/native';
import style from './BottomBarStyle';

const BottomBars = () => {
  const navigation = useNavigation();

  const navigateToRooms = () => {
    navigation.navigate('Rooms');
  };

  const navigateToProfile = () => {
    navigation.navigate('profile');
  };

  return (
    <View style={style.container}>
      <View style={style.Box}>
        <TouchableOpacity onPress={navigateToRooms} style={style.ButtonBox}>
          <View>
            <Icons name="message-circle" type="feather" size={30} />
          </View>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>Rooms</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToProfile} style={style.ButtonBox}>
          <View>
            <Icons name="user" type="font-awesome-5" />
          </View>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomBars;
