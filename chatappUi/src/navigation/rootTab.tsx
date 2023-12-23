import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Auth from './auth';
import { useSelector } from 'react-redux';
import { State, getLoggedInUserDetailsType } from '../types';
import Main from './main';

const Index = () => {
  const getLoggedInUserDetails = useSelector<State, getLoggedInUserDetailsType>(
    state => state.getLoggedInUserDetails,
  );
  console.log(getLoggedInUserDetails);
  const logined = !!getLoggedInUserDetails;

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        header: () => null,
      }}
      initialRouteName={logined ? 'Home' : 'Auth'}>
      {!logined && <Stack.Screen name="Auth" component={Auth} />}
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
