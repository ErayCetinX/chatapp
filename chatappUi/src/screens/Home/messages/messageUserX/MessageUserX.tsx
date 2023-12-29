import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import React, { useState, useEffect } from 'react';
import { MessageQuery } from '../../../../request/query';
import { useQuery } from '@apollo/client';
import MessageInput from '../../../../components/messages/MessageInput/MessageInput';
import MessageContent from '../../../../components/messages/messageContent/MessageContent';
import MessageHeader from '../../../../components/messages/messageHeader/MessageHeader';
import { MessageSub } from '../../../../request/subscription';
import { useSelector } from 'react-redux';
import { getLoggedInUserDetailsType, State } from '../../../../types';

interface Props {
  route: {
    params: {
      boxUuid: string;
      recipientUserUuid: string;
      UserName: string;
      UserAvatar: string;
    };
  };
}

const MessageUserX: React.FC<Props> = props => {
  const { recipientUserUuid, UserAvatar, UserName, boxUuid,createdAt } =
    props.route.params;

  const activeUser = useSelector<State, getLoggedInUserDetailsType>(state => state.getLoggedInUserDetails);

  const { data, refetch, subscribeToMore, fetchMore } = useQuery(MessageQuery, {
    variables: { recipientUserUuid, limit: 20, offset: 0 },
  });

  // message subs buradan al MessageContente gönder oradan sürekli çalıştır falan nebilim
  useEffect(() => {
    refetch();
  }, [refetch]);

  const [IsReply, SetIsReply] = useState<boolean>(false);
  const [IsReplyPicture, SetIsReplyPicture] = useState<boolean>(false);
  const [MessageUuid, SetMessageUuid] = useState<string>('');
  const [MessageReply, SetMessageReply] = useState<string>('');
  const [ReplyMessagePicture, SetReplyMessagePicture] = useState<string>('');
  const [ReplyMessageUser, SetReplyMessageUser] = useState<string>('');
  const [ShowLoading, setShowLoading] = useState(false);



  return (
    <View style={{ height: '100%' }}>
      <MessageHeader UserAvatar={UserAvatar} UserName={UserName} createdAt={createdAt} />
      <View style={{ flex: 1, height: '100%' }}>
        <FlashList
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
          inverted={true}
          data={data?.messages || []}
          onEndReached={() => {
            fetchMore({
              variables: {
                recipientUserUuid,
                offset: data?.messages?.length,
              },
            }).then(FetchedData => {
              if (FetchedData?.data?.messages?.length === data.messages.length) {
                setShowLoading(false);
              }
              if (FetchedData.loading === true) {
                setShowLoading(true);
              }
            });
          }}
          onEndReachedThreshold={0.5}
          renderItem={({ item, index }) => (
            <MessageContent
              UpdateMessageSubs={() => {
                subscribeToMore({
                  document: MessageSub,
                  variables: { userUuid: recipientUserUuid },
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) {
                      return prev;
                    }
                    const newFeedItem = subscriptionData.data.newMessage;
                    if (newFeedItem?.senderUuid !== activeUser.uuid) {
                      if (
                        !prev.messages.find(
                          (a: { uuid: string }) => a.uuid === newFeedItem.uuid,
                        )
                      ) {
                        return {
                          ...prev,
                          messages: [newFeedItem, ...prev.messages],
                        };
                      } else {
                        return prev;
                      }
                    }
                  },
                });
              }}
              UserMessage={item}
              UserAvatar={UserAvatar}
              UserName={UserName}
              SetIsReply={SetIsReply}
              SetMessageUuid={SetMessageUuid}
              SetReplyMessage={SetMessageReply}
              SetReplyMessageUser={SetReplyMessageUser}
              SetIsReplyPicture={SetIsReplyPicture}
              SetReplyMessagePicture={SetReplyMessagePicture}
            />
          )}
        />
      </View>
      <MessageInput
        recipientUserUuid={recipientUserUuid}
        IsReply={IsReply}
        IsReplyPicture={IsReplyPicture}
        MessageReply={MessageReply}
        MessageUuid={MessageUuid}
        ReplyMessagePicture={ReplyMessagePicture}
        ReplyMessageUser={ReplyMessageUser}
        SetIsReply={SetIsReply}
        refetch={refetch}
        boxUuid={boxUuid}
      />
    </View>
  );
};

export default MessageUserX;
