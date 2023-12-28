import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/userSlice';
import { State } from '../types';
import RootTab from './rootTab';

const Index:React.FC<{refetch: () => void}> = ({ refetch }) => {
  const Theme = useSelector<State>(state => state.Theme);
  const dispatch = useDispatch();


  const backgroundColor: string =
    Theme === 'Dark' ? '#010101' : Theme === 'Light' ? '#fff' : '#fff';

  const RootStack = createStackNavigator();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          backgroundColor={backgroundColor}
          barStyle={
            Theme === 'Light'
              ? 'dark-content'
              : Theme === 'Dark'
              ? 'light-content'
              : Theme === 'NightBlue'
              ? 'light-content'
              : 'dark-content'
          }
        />
        <RootStack.Navigator
          screenOptions={{ gestureEnabled: false, headerShown: false }}>
          <RootStack.Screen name="RootTab">
            {() => <RootTab refetch={refetch} />}
          </RootStack.Screen>
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Index;
