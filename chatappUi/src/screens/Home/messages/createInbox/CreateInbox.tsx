import { View, TextInput, FlatList } from 'react-native';

import React, { useState } from 'react';
import style from './CreateInboxStyle';

import {
  Button,
  Icons,
  Text,
} from '../../../../components/ui';
import { useMutation, useQuery } from '@apollo/client';
import {
  SearchQuery,
  UserInboxQuery,
  SerchMessageUserQuery,
} from '../../../../request/query';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { CreateInboxMutation } from '../../../../request/mutation';

const CreateInbox = () => {
  const navigation = useNavigation();

  const [text, Settext] = useState<string>('');
  const [SelectUser, SetSelectUser] = useState<boolean>(false);
  const [SelectUserInfo, SetSelectUserInfo] = useState<string>('');
  const [UserName, SetUserName] = useState<string>('');
  const [UserAvatar, SetUserAvatar] = useState<string>('');

  const { data } = useQuery(SearchQuery, {
    variables: { username: text },
  });


  const MessageQuery = useQuery(UserInboxQuery);
  const [createInbox] = useMutation(CreateInboxMutation);

  const handleSelect = (UserUuid: string, Avatar: string, Name: string) => {
    if (SelectUser === true) {
      SetSelectUser(false);
      SetSelectUserInfo('');
      SetUserAvatar('');
      SetUserName('');
    } else {
      SetSelectUser(true);
      SetSelectUserInfo(UserUuid);
      SetUserAvatar(Avatar);
      SetUserName(Name);
    }
  };

  // !!burada create olurken error var
  // !! message oluşurken message undifened geliyor
  // !! bu da hata sebebi
  // !! varan 1 message:[] gönder
  const CreateInboxPress = () => {
    createInbox({
      variables: { UserUuid: SelectUserInfo },
      refetchQueries: [
        { query: UserInboxQuery },
        { query: SerchMessageUserQuery },
      ],
    }).then(() => {
      MessageQuery.refetch();
      SetSelectUser(false);
      SetSelectUserInfo('');
      navigation.navigate('MessageUserX', {
        UserName,
        UserAvatar,
        recipientUserUuid: SelectUserInfo,
      });
    });
  };

  const color: string = '#000';

  return (
    <View style={style.container}>
      <View style={[style.Header, { borderBottomColor: color }]}>
        <View style={style.Icon}>
          <Button
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}>
            <Icons name="arrow-back" type="material" color={color} />
          </Button>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            width: '100%',
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <TextInput
              value={text}
              onChangeText={e => Settext(e)}
              style={[style.Input, { color, width: '100%' }]}
              placeholder="Search User"
              placeholderTextColor={'#363636'}
              selectionColor="#04C484"
              autoFocus={true}
              autoCapitalize={'none'}
              autoCorrect={false}
            />
          </View>
          {text.trim() !== '' && text.length > 0 && (
            <React.Fragment>
              <Button
                activeOpacity={0.8}
                onPress={() => {
                  Settext('');
                  SetSelectUser(false);
                  SetSelectUserInfo('');
                  SetUserAvatar('');
                  SetUserName('');
                }}>
                <Icons name="x" type="feather" size={24} color={color} />
              </Button>
              {SelectUser ? (
                <Button
                  onPress={CreateInboxPress}
                  activeOpacity={0.8}
                  style={style.Create}>
                  <Text
                    text="Create"
                    buttonText
                    style={style.CreateText}
                  />
                </Button>
              ) : null}
            </React.Fragment>
          )}
        </View>
      </View>
      <View style={style.content}>
        {text.trim() === '' && (
          <View style={style.Text}>
            <Text
              text={'Search for the user you want to message'}
              buttonText={false}
              style={style.TextContent}
            />
          </View>
        )}
        {text.trim() !== '' && text.length > 0 && (
          <View style={style.UserResult}>
            <FlatList
              data={data?.searchUser || []}
              renderItem={({ item }) => {
                return (
                  <Button
                    activeOpacity={0.8}
                    style={style.User}
                    onPress={() =>
                      handleSelect(item.uuid, item.avatarUrl, item.username)
                    }
                    key={item.uuid}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={style.UserImage}>
                          <FastImage
                            source={{
                              uri: item.avatarUrl,
                              priority: FastImage.priority.normal,
                              cache: FastImage.cacheControl.immutable,
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 25,
                            }}
                          />
                        </View>
                        <View style={style.UserInfo}>
                          <Text
                            buttonText={false}
                            style={style.UserText}
                            text={item.username}
                          />
                        </View>
                      </View>
                      <View style={style.CheckBox}>
                        <Icons
                          name={
                            SelectUserInfo === item.uuid
                              ? 'dot-circle-o'
                              : 'circle-o'
                          }
                          type="font-awesome"
                          color="#04C484"
                        />
                      </View>
                    </View>
                  </Button>
                );
              }}
              keyExtractor={(item: { uuid: string }) => item.uuid}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default CreateInbox;
