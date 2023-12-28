import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import style from './MessageContentStyle';
import { Button, Text } from '../../ui';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import { getLoggedInUserDetailsType, State } from '../../../types';

interface Props {
  UserMessage: {
    uuid: string;
    recipientUuid: string;
    senderUuid: string;
    text: string;
    pictureUrl: string;
    replyMessage: string;
    replyMessagePictureUrl: string;
    replyMessageUserUuid: string;
    isReply: boolean;
    isPicture: boolean;
    createdAt: Date;
  };
  previousOne: boolean;
  UserAvatar: string;
  UserName: string;
  SetIsReply: Function;
  SetMessageUuid: Function;
  SetReplyMessage: Function;
  SetReplyMessageUser: Function;
  SetIsReplyPicture: Function;
  SetReplyMessagePicture: Function;
  UpdateMessageSubs: Function;
  DeleteMessageSubs: Function;
}

const MessageContent: React.FC<Props> = props => {
  const {
    UpdateMessageSubs,
    previousOne,
    UserMessage: {
      text,
      createdAt,
      senderUuid,
      isReply,
      replyMessageUserUuid,
      replyMessage,
    },
    UserName,
    DeleteMessageSubs,
  } = props;

  useEffect(() => {
    UpdateMessageSubs();
  }, [UpdateMessageSubs, DeleteMessageSubs]);

  const getLoggedInUserDetails = useSelector<State, getLoggedInUserDetailsType>(state => state.getLoggedInUserDetails);
  const backgroundColor = '#04C484';

  const [ShowEdit, SetShowEdit] = useState<boolean>(false);

  // websocekt silme yap
  // silince karşı tarafda silinsin

  return (
    <View style={[style.container, { marginVertical: previousOne ? 1 : 10 }]}>
      <View style={style.pdg}>
        <View style={style.Barr}>
          {senderUuid === getLoggedInUserDetails.uuid ? (
            <Button
              activeOpacity={0.8}
              style={style.ActiveuserItem}
              onPress={() => SetShowEdit(false)}
              onLongPress={() => SetShowEdit(!ShowEdit)}>
              <View style={style.ActiveuserContainer}>
                <View style={[style.ActiveMessageContent, { backgroundColor }]}>
                  {isReply && (
                    <View
                      style={{
                        backgroundColor: isReply && '#252627',
                        marginBottom: isReply && 5,
                        padding: isReply && 5,
                        borderRadius: isReply && 5,
                        opacity: 0.7,
                        marginTop: 10,
                      }}>
                      <View style={[style.GuestuserUserName, { padding: 0 }]}>
                        <Text
                          style={style.GuestUserNameText}
                          text={`${
                            replyMessageUserUuid === getLoggedInUserDetails.uuid
                              ? 'You'
                              : replyMessageUserUuid !== getLoggedInUserDetails.uuid &&
                                UserName
                          }`}
                          buttonText={false}
                        />
                      </View>

                      <View style={{ flexDirection: 'row', flex: 1 }}>
                        {replyMessage.length > 0 && (
                          <View
                            style={[
                              style.GuestMessage,
                              {
                                justifyContent: isReply && 'center',
                                marginBottom: isReply ? 0 : 10,
                                paddingLeft: isReply ? 6 : 0,
                                paddingRight: isReply ? 6 : 0,
                                paddingBottom: isReply ? 6 : 0,
                              },
                            ]}>
                            <Text
                              buttonText={false}
                              style={style.MessageContent}
                              numberOfLines={isReply ? 3 : 0}
                              text={replyMessage}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                  {text.length > 0 && text.trim() !== '' && (
                    <View style={style.ActiveMessage}>
                      <Text
                        style={style.MessageContent}
                        buttonText={false}
                        text={text}
                      />
                    </View>
                  )}
                  <Text
                    style={{
                      paddingBottom: 10,
                      fontSize: 12,
                      marginLeft: 'auto',
                    }}
                    text={Moment.utc(createdAt)
                      .local()
                      .startOf('seconds')
                      .fromNow()}
                    buttonText={true}
                  />
                </View>
              </View>
            </Button>
          ) : (
            <View style={style.userItem}>
              <View style={style.GuestContainer}>
                <View style={[style.GuestMessageContent, { backgroundColor }]}>
                  {isReply && (
                    <View
                      style={{
                        backgroundColor: isReply && '#9c9c9c',
                        marginBottom: isReply && 5,
                        padding: isReply && 5,
                        borderRadius: isReply && 5,
                        opacity: 0.7,
                        marginTop: 10,
                      }}>
                      <View style={[style.GuestuserUserName, { padding: 0 }]}>
                        <Text
                          buttonText={false}
                          text={`${
                            replyMessageUserUuid === getLoggedInUserDetails.uuid
                              ? 'You'
                              : replyMessageUserUuid !== getLoggedInUserDetails.uuid &&
                                UserName
                          }`}
                          style={[style.GuestuserUserName]}
                        />
                      </View>
                      <View style={{ flexDirection: 'row', flex: 1 }}>
                        {replyMessage.length > 0 && (
                          <View
                            style={[
                              style.GuestMessage,
                              {
                                justifyContent: isReply && 'center',
                                marginBottom: isReply ? 0 : 10,
                                paddingLeft: isReply ? 6 : 0,
                                paddingRight: isReply ? 6 : 0,
                                paddingBottom: isReply ? 6 : 0,
                              },
                            ]}>
                            <Text
                              buttonText={false}
                              style={style.MessageContent}
                              numberOfLines={isReply ? 3 : 0}
                              text={replyMessage}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                  {text.length > 0 && (
                    <View style={style.GuestMessage}>
                      <Text
                        style={style.MessageContent}
                        buttonText={false}
                        text={text}
                      />
                    </View>
                  )}
                  <Text
                    style={{
                      paddingBottom: 10,
                      fontSize: 12,
                      marginLeft: 'auto',
                    }}
                    text={Moment.utc(createdAt)
                      .local()
                      .startOf('seconds')
                      .fromNow()}
                    buttonText={true}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default React.memo(MessageContent);
