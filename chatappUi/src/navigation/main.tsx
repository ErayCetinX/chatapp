import React from 'react';

// Router
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import Profile from '../screens/Home/Profile/Profile';

// Components
import BottomBars from '../components/bar/BottomBar/BottomBars';
import MessageBox from '../screens/Home/messages/messageBox/MessageBox';
import CreateInbox from '../screens/Home/messages/createInbox/CreateInbox';
import MessageUserX from '../screens/Home/messages/messageUserX/MessageUserX';
import Settings from '../screens/Home/Settings/Settings';
import Search from '../screens/Home/Search/Search';

const Home = () => {
  const BottomTab = createBottomTabNavigator();
  return (
    <BottomTab.Navigator tabBar={() => <BottomBars />} screenOptions={{ headerShown: false }}>
      <BottomTab.Screen name="Rooms" component={MessageBox} />
      <BottomTab.Screen name="Settings" component={Settings} />
      {/* Uncomment the following lines once you have the corresponding components */}
      {/* <BottomTab.Screen name="NotificationsIndex" component={NotificationsStack} /> */}
      {/* <BottomTab.Screen name="ProtectedPosts" component={Saved} /> */}
      {/* <BottomTab.Screen name="SettingsIndex">{() => <SettingsStack refetch={refetch} />}</BottomTab.Screen> */}
      <BottomTab.Screen name="Profile" component={Profile} />
    </BottomTab.Navigator>
  );
};

const Main = () => {
  const StackTab = createStackNavigator();

  return (
    <StackTab.Navigator screenOptions={{ header:() => null }} initialRouteName="Main">
      <StackTab.Screen name="Main" component={Home} />
      <StackTab.Screen name="CreateInbox" component={CreateInbox} />
      <StackTab.Screen name="MessageUserX" component={MessageUserX} />
      <StackTab.Screen name="Search" component={Search} />
    </StackTab.Navigator>
  );
};

export default Main;
