import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Auth from './auth';
import { useSelector } from 'react-redux';
import { State, getLoggedInUserDetailsType } from '../types';
import Main from './main';

const Index:React.FC<{refetch}> = ({ refetch }) => {
  const getLoggedInUserDetails = useSelector<State, getLoggedInUserDetailsType>(
    state => state.getLoggedInUserDetails,
  );
  const logined = !!getLoggedInUserDetails;

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        header: () => null,
      }}
      initialRouteName={logined ? 'Home' : 'Auth'}>
      {!logined && <Stack.Screen name="Auth">
        {() => <Auth refetch={refetch} />}
        </Stack.Screen>}
      {logined && (
        <React.Fragment>
          <Stack.Screen name="Home">
            {() => <Main />}
          </Stack.Screen>
        </React.Fragment>
      )}
    </Stack.Navigator>
  );
};

export default Index;
