import { View, Text } from 'react-native';
import React from 'react';
import { Button, Icons } from '../../ui';
import { useSelector } from 'react-redux';
import { State } from '../../../types';
import { useNavigation } from '@react-navigation/native';
import { Image } from '@rneui/base';
import style from './MessageHeaderStyle';

interface Props {
  UserName: string;
  UserAvatar: string;
}

const MessageHeader: React.FC<Props> = ({ UserName, UserAvatar }) => {
  const Theme = useSelector<State>(state => state.Theme);
  const navigation = useNavigation();

  const color: string = '#000';

  const backgroundColor: string = '#fff';
  return (
    <View
      style={[
        style.container,
        {
          backgroundColor,
          borderBottomColor: color,
        },
      ]}>
      <View style={style.pdg}>
        <View style={style.Left}>
          <Button
            onPress={() => navigation.navigate('Rooms')}
            activeOpacity={0.8}>
            <Icons name="arrow-back" type="material" color={color} />
          </Button>
        </View>
        <View style={style.User}>
          <View style={style.UserImage}>
            <Button
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('Profile', {
                  username: UserName,
                  avatarUrl: UserAvatar,
                });
              }}>
              <Image
                source={{ uri: UserAvatar }}
                style={{ width: 35, height: 35, borderRadius: 35 }}
              />
            </Button>
          </View>
          <View style={style.UserName}>
            <Button
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('Profile', {
                  username: UserName,
                  avatarUrl: UserAvatar,
                });
              }}>
              <Text
                style={[
                  style.UserNameText,
                  {
                    color,
                  },
                ]}>
                {UserName}
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(MessageHeader);
