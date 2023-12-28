import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';
import style from './SearchStyle';
import { Button, Icons, Text as WhoollyText } from '../../../components/ui';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { UserInboxQuery } from '../../../request/query';
import { Image } from '@rneui/base';
import { useSelector } from 'react-redux';
import { State } from '../../../types';

const Search = () => {
  const Theme = useSelector<State>(state => state.Theme);
  const navigation = useNavigation();
  const [UserName, setUserName] = useState<string>('');
  const [userData, setUserData] = useState();

  const { data, loading } = useQuery(UserInboxQuery);
  useEffect(() => {
    setUserData(data?.userInbox?.node);
  },[data?.userInbox?.node]);

  const ColorsText: string =
    Theme === 'Dark'
      ? '#fff'
      : Theme === 'NightBlue'
      ? '#fff'
      : Theme === 'Light'
      ? '#000'
      : '#000';

  const backgroundColor: string =
    Theme === 'Dark'
      ? '#121212'
      : Theme === 'NightBlue'
      ? '#273340'
      : Theme === 'Light'
      ? '#efefef'
      : '#efefef';

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Button activeOpacity={0.8} onPress={() => navigation.goBack()}>
          <Icons name="arrow-back" type="material" color={ColorsText} />
        </Button>
        <View style={[style.Inputs, { backgroundColor }]}>
          <TextInput
            autoCapitalize="sentences"
            value={UserName}
            onChangeText={e => setUserName(e)}
            multiline={false}
            autoCorrect={false}
            autoFocus={true}
            style={[style.Input, { color: ColorsText }]}
            placeholder="Search"
            placeholderTextColor="#808080"
          />
          {UserName.trim() !== '' && UserName.length > 0 && (
            <Button
              onPress={() => setUserName('')}
              style={{ marginRight: 8 }}>
              <Icons
                name="x"
                type="feather"
                size={24}
                color={ColorsText}
              />
            </Button>
          )}
        </View>
      </View>
      {UserName.length === 0 && UserName.trim() === '' && (
        <View style={style.DescContainer}>
          <Text style={[style.Desc, { color: ColorsText }]}>
            You can search entering a few words.
          </Text>
        </View>
      )}
      {UserName.length > 0 && (
        <View style={{ height: '100%' }}>
          <FlashList
            estimatedItemSize={100}
            data={userData || []}
            renderItem={({ item }) => (
              <Button
                style={style.ResultContent}
                activeOpacity={0.9}
                onPress={() => {
                  navigation.navigate('MessageUserX', {
                    screen: 'Profile',
                    UserName: item.username,
                  });
                }}>
                <View style={style.ResultFlex}>
                  <View style={{ marginRight: 10 }}>
                    <Image
                      source={{ uri: item.avatarUrl }}
                      style={{ width: 40, height: 40, borderRadius: 999 }}
                      PlaceholderContent={
                        <ActivityIndicator color={ColorsText} />
                      }
                    />
                  </View>
                  <View style={style.UserContent}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text
                        style={[
                          style.User,
                          {
                            color: ColorsText,
                          },
                        ]}>
                        {item.username}
                      </Text>
                    </View>
                  </View>
                </View>
              </Button>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Search;
