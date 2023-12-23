import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Rooms from '../screens/Home/Rooms/Rooms';
import Profile from '../screens/Home/Profile/Profile';
import BottomBars from '../components/bar/BottomBar/BottomBars';

const Main = () => {
  const BottomTab = createBottomTabNavigator();

  return (
    <BottomTab.Navigator tabBar={BottomBars} screenOptions={{ headerShown: false }}>
      <BottomTab.Screen name="Rooms" component={Rooms} />
      {/* Uncomment the following lines once you have the corresponding components */}
      {/* <BottomTab.Screen name="NotificationsIndex" component={NotificationsStack} /> */}
      {/* <BottomTab.Screen name="ProtectedPosts" component={Saved} /> */}
      {/* <BottomTab.Screen name="SettingsIndex">{() => <SettingsStack refetch={refetch} />}</BottomTab.Screen> */}
      <BottomTab.Screen name="Profile" component={Profile} />
    </BottomTab.Navigator>
  );
};

export default Main;
