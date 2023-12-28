import { ActivityIndicator, View } from 'react-native';
import { Text } from '../../../../components/ui';
import React, { useState } from 'react';
import Tabbar from '../../../../components/bar/TabBar/TabBar';

// query
import { UserInboxQuery } from '../../../../request/query';
import { useQuery } from '@apollo/client';
import { FlashList } from '@shopify/flash-list';
import Items from '../../../../components/messages/items/Items';

const MessageBox = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, loading, refetch } = useQuery(UserInboxQuery);

  const onRefreshData = () => {
    setIsRefreshing(false);
    refetch();
  };

  const dataLength = data?.userInbox?.node.length > 0;

  return (
    <View style={{ backgroundColor: '#F6F2FD',flex:1 }}>
      <Tabbar />
      <React.Fragment>
        <View
          style={{
            marginTop: 12,
            backgroundColor: '#FEFEFF',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            flex:1,
          }}>
          <View
            style={{
              flex:1,
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginTop: 12,
            }}>
            <Text text={'Chats'} style={{ fontSize: 32, fontWeight: '700' }} />
            {loading ? (
              <React.Fragment>
                <View>
                  <ActivityIndicator size={30} color={'#252627'} />
                </View>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {dataLength ? (
                  <FlashList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={data?.userInbox?.node || []}
                    refreshing={isRefreshing}
                    onRefresh={onRefreshData}
                    renderItem={({ item }) => {
                      if (item === null) {
                        return <></>;
                      }
                      return (
                        <Items
                          avatarUrl={item?.avatarUrl}
                          lastMessage={item?.lastMessage}
                          username={item?.username}
                          uuid={item?.uuid}
                          InboxUuid={item?.InboxUuid}
                        />
                      );
                    }}
                    keyExtractor={(_, index) => index.toString()}
                    estimatedItemSize={200}
                  />
                ) : (
                  <View
                    style={{
                      width: '100%',
                      height: '75%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}>
                    <Text
                      style={{ fontSize: 17 }}
                      text={'You are not texting anyone.'}
                      buttonText={false}
                    />
                    <Text
                      style={{
                        color: '#04C484',
                        fontSize: 17,
                        fontWeight: '700',
                      }}
                      text={'You should create one.'}
                      buttonText={false}
                    />
                  </View>
                )}
              </React.Fragment>
            )}
          </View>
        </View>
      </React.Fragment>
    </View>
  );
};

export default MessageBox;
