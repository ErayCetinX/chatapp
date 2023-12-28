import { View, TextInput, ActivityIndicator, Text } from 'react-native';
import React, { useState } from 'react';
import style from './MessageInputStyle';
import { useSelector } from 'react-redux';
import { State } from '../../../types';
import { Button, Icons, Text as WhoollyText } from '../../ui';
import { useMutation } from '@apollo/client';
import {
  MessageMutations,
  ReplyMessageMutation,
} from '../../../request/mutation';
import { MessageQuery, UserInboxQuery } from '../../../request/query';
import { Image } from '@rneui/base';

interface Props {
  recipientUserUuid: string;
  refetch: Function;
  IsReply: boolean;
  MessageUuid: string;
  MessageReply: string;
  ReplyMessageUser: string;
  SetIsReply: Function;
  IsReplyPicture: boolean;
  ReplyMessagePicture: string;
  boxUuid: string;
}
const MessageInput: React.FC<Props> = props => {
  const {
    recipientUserUuid,
    refetch,
    IsReply,
    MessageUuid,
    MessageReply,
    ReplyMessageUser,
    SetIsReply,
    IsReplyPicture,
    ReplyMessagePicture,
  } = props;

  const Theme = useSelector<State>(state => state.Theme);
  const borderColor: string =
    Theme === 'Dark'
      ? '#fff'
      : Theme === 'NightBlue'
      ? '#fff'
      : Theme === 'Light'
      ? '#000'
      : '#000';

  const color: string =
    Theme === 'Dark'
      ? '#fff'
      : Theme === 'NightBlue'
      ? '#fff'
      : Theme === 'Light'
      ? '#000'
      : '#000';

  const [MessageText, SetMessageText] = useState('');
  const ASD = useMutation(MessageMutations);
  const [ReplyMessage, { loading: ReplyLoading }] =
    useMutation(ReplyMessageMutation);

    const createMessage = ASD[0];
    const { loading } = ASD[1];
    console.log(ASD);

  const SendMessage = () => {
    createMessage({
      variables: { text: MessageText.trim(), recipientUserUuid },
      update (cache, { data: { createMessage } }) {
        const userMessageCache = cache.readQuery({
          query: MessageQuery,
          variables: { recipientUserUuid },
        });

        if (userMessageCache?.messages.length > 0) {
          cache.writeQuery({
            query: MessageQuery,
            data: {
              messages: [createMessage, ...userMessageCache?.messages],
            },
            variables: { recipientUserUuid },
          });
        } else {
          cache.writeQuery({
            query: MessageQuery,
            data: {
              messages: [createMessage],
            },
            variables: { recipientUserUuid },
          });
        }
      },
    }).then(() => {
      refetch();
      SetMessageText('');
    });
  };
  const ReplyMessagePress = () => {
    if (IsReplyPicture === false) {
      ReplyMessage({
        variables: {
          MessageUuid,
          recipientUserUuid,
          text: MessageText.trim(),
          replyMessage: MessageReply,
        },
        refetchQueries: [
          { query: UserInboxQuery },
          { query: MessageQuery, variables: { recipientUserUuid } },
        ],
      }).then(() => {
        SetIsReply(false);
        SetMessageText('');
      });
    }
  };

  const backgroundColor: string =
    Theme === 'Dark'
      ? '#202020'
      : Theme === 'NightBlue'
      ? '#22303C'
      : Theme === 'Light'
      ? '#dcdcdc'
      : '#dcdcdc';

  const itemColor: string =
    Theme === 'Dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : Theme === 'NightBlue'
      ? 'rgba(247, 249, 249, 0.1)'
      : Theme === 'Light'
      ? 'rgba(0, 0, 0, 0.05)'
      : 'rgba(0, 0, 0, 0.05)';

  return (
    <View style={style.sendMessage}>
      {IsReply && (
        <View style={[style.ReplyContainer, { backgroundColor }]}>
          <View style={{ padding: 8 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '100%',
                  maxWidth: '85%',
                }}>
                <WhoollyText
                  text={ReplyMessageUser}
                  numberOfLines={1}
                  style={{ fontWeight: '700' }}
                  buttonText={false}
                />
              </View>
              <Button
                activeOpacity={0.8}
                onPress={() => SetIsReply(false)}
                style={{
                  backgroundColor: itemColor,
                  borderRadius: 9999,
                  padding: 4,
                }}>
                <Icons name="x" type="feather" size={22} color={color} />
              </Button>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {MessageReply.length > 0 && (
                <View style={{ flex: 1 }}>
                  <WhoollyText
                    text={MessageReply}
                    numberOfLines={3}
                    buttonText={false}
                  />
                </View>
              )}
              {IsReplyPicture && (
                <View style={{ marginTop: 5, marginLeft: 5 }}>
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 3 }}
                    source={{ uri: ReplyMessagePicture }}
                    PlaceholderContent={<ActivityIndicator color={color} />}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      )}
      <View
        style={[
          style.Border,
          {
            borderColor,
          },
        ]}>
        <View style={style.pdgHe}>
          <View style={style.Flex}>
            <View style={{ flexDirection: 'row', width: '100%', flex: 1 }}>
              <View style={style.Input}>
                <TextInput
                  placeholder="Write"
                  placeholderTextColor={color}
                  value={MessageText}
                  onChangeText={Message => SetMessageText(Message)}
                  style={[
                    style.TextInput,
                    {
                      color,
                    },
                  ]}
                  multiline
                  editable={
                    loading === true
                      ? false
                      : ReplyLoading === true
                      ? false
                      : true
                  }
                />
              </View>
              {MessageText.trim() !== '' && MessageText.length > 0 ? (
                <Button
                  activeOpacity={0.8}
                  style={style.Button}
                  onPress={IsReply ? ReplyMessagePress : SendMessage}
                  disabled={
                    loading === true
                      ? true
                      : ReplyLoading === true
                      ? true
                      : MessageText.length === 0
                      ? true
                      : false
                  }>
                  <Text
                    style={[
                      style.ButtonColor,
                      {
                        color: loading
                          ? '#808080'
                          : ReplyLoading
                          ? '#808080'
                          : MessageText.length > 0
                          ? '#04C484'
                          : '#808080',
                      },
                    ]}>
                    Send
                  </Text>
                </Button>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(MessageInput);
