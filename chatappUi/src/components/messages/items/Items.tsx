import { View } from 'react-native';
import React, { useState } from 'react';
import style from './ItemsStyle';
import { Button, Icons, Text } from '../../ui';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { DeleteInboxMutation } from '../../../request/mutation';
import { UserInboxQuery } from '../../../request/query';

interface Props {
  uuid: string;
  avatarUrl: string;
  username: string;
  lastMessage: string;
  InboxUuid?: string;
}

const UserItem: React.FC<Props> = props => {
  const { avatarUrl, username, lastMessage, uuid, InboxUuid } = props;
  const [longPress, setlongPress] = useState<boolean | Element>(false);
  const navigation = useNavigation();

    const [DeleteInbox] = useMutation(DeleteInboxMutation);

  const Press = () => {
    navigation.navigate('MessageUserX', {
      boxUuid: uuid,
      UserName: username,
      UserAvatar: avatarUrl,
      recipientUserUuid: uuid,
    });
    setlongPress(false);
  };

  const DeleteInboxPress = (uuid: string) => {
    DeleteInbox({
      variables: { InboxUuid: uuid },
      refetchQueries: [{ query: UserInboxQuery }],
    });
    setlongPress(false);
  };

  return (
    <Button
      onLongPress={() => setlongPress(true)}
      onPress={Press}
      activeOpacity={1}
      style={style.userContainer}>
      <React.Fragment>
        <FastImage
          source={{
            uri: avatarUrl,
            priority: FastImage.priority.normal,
          }}
          style={style.Images}
        />

        <View style={style.Text}>
          <Text
            buttonText={false}
            text={username}
            style={style.userName}
            numberOfLines={1}
          />
          {lastMessage?.trim()?.length > 0 ? (
            <Text
              buttonText={false}
              text={lastMessage}
              style={style.message}
              numberOfLines={1}
            />
          ) : null}
        </View>

        {longPress && (
          <Button
            activeOpacity={0.7}
            style={{ padding: 12 }}
            onPress={() => DeleteInboxPress(InboxUuid)}>
            <Icons name="trash-alt" type="font-awesome-5" color="#dc3545" />
          </Button>
        )}
      </React.Fragment>
    </Button>
  );
};

export default React.memo(UserItem);
