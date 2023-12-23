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

const Index = () => {
  const Theme = useSelector<State>(state => state.Theme);
  const dispatch = useDispatch();
  let ThemeColor;

  useEffect(() => {
    const SetTheme = async () => {
      const CurrentTeheme = await AsyncStorage.getItem('Theme');
      if (CurrentTeheme) {
        dispatch(setTheme(CurrentTeheme));
      }
    };
    SetTheme();
  }, [dispatch]);

  const backgroundColor: string =
    Theme === 'Dark' ? '#010101' : Theme === 'Light' ? '#fff' : '#fff';

  if (Theme === 'Dark') {
    ThemeColor = {
      dark: true,
      colors: {
        primary: '#0a84ff',
        background: '#010101',
        card: 'rgb(18, 18, 18)',
        text: 'rgb(229, 229, 231)',
        border: 'rgb(39, 39, 41)',
        notification: 'rgb(255, 69, 58)',
      },
    };
  } else if (Theme === 'Light') {
    ThemeColor = {
      dark: false,
      colors: {
        primary: 'rgb(0, 122, 255)',
        background: '#fff',
        card: 'rgb(255, 255, 255)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(216, 216, 216)',
        notification: 'rgb(255, 59, 48)',
      },
    };
  } else {
    ThemeColor = {
      dark: false,
      colors: {
        primary: 'rgb(0, 122, 255)',
        background: '#fff',
        card: 'rgb(255, 255, 255)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(216, 216, 216)',
        notification: 'rgb(255, 59, 48)',
      },
    };
  }

  const RootStack = createStackNavigator();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={ThemeColor}>
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
            {() => <RootTab />}
          </RootStack.Screen>
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Index;
