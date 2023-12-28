import React from 'react';
import { Text, View } from 'react-native';
import { Button, Icons } from '../../ui';
import { useNavigation } from '@react-navigation/native';
import style from './BottomBarStyle';

const BottomBars: React.FC = () => {
  const navigation = useNavigation();

  const navigateToRooms = () => {
    navigation.navigate('Rooms');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={style.container}>
      <View style={style.Box}>
        <Button onPress={navigateToRooms} style={style.ButtonBox}>
          <View>
            <Icons name="message-circle" type="feather" size={30} />
          </View>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>Chat</Text>
        </Button>
        <Button onPress={navigateToSettings} style={style.ButtonBox}>
          <View>
            <Icons name="settings" type="simple-line-icon" color="#000" />
          </View>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>Settings</Text>
        </Button>
      </View>
    </View>
  );
};

export default BottomBars;
