import { View } from 'react-native';
import React from 'react';
import style from './SettingsStyle';
import { Button, Icons, Text } from '../../../components/ui';
import { ApolloConsumer, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLoggedInUserDetailsQuery } from '../../../request/query';

const Settings = () => {
    const loginedUser = useQuery(getLoggedInUserDetailsQuery);
  const EndSession = async (client: any) => {
    await AsyncStorage.setItem('token', '');
    client.resetStore();
    await loginedUser.refetch();
  };
  return (
    <View style={style.container}>
      <Text text={'Settings'} style={{ fontSize: 22, fontWeight: '700' }} />
      <View>
        <ApolloConsumer>
          {client => (
            <Button
              onPress={() => EndSession(client)}
              style={{
                borderRadius: 5,
                marginBottom: 10,
                padding: 12,
              }}>
              <View style={[style.CardContainer]}>
                <View style={style.CardIcon}>
                  <Icons
                    name="sign-out"
                    type="octicon"
                    color={'#252627'}
                    size={25}
                  />
                </View>
                <View style={style.CardType}>
                  <Text
                    style={[
                      style.CardTypeName,
                      {
                        color: '#505050',
                      },
                    ]}
                    text={'Log out'}
                  />
                  <Text
                    style={[
                      style.CardTypeDescription,
                      {
                        color: '#121212',
                      },
                    ]}
                    text={'End your session'}
                  />
                </View>
              </View>
            </Button>
          )}
        </ApolloConsumer>
      </View>
    </View>
  );
};

export default Settings;
