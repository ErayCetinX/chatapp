import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Auth/Login/Login';
import Register from '../screens/Auth/Register/Register';
// import ForgotPassword from '../screens/Auth/ForgotPassword/ForgotPassword';

const Auth = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> */}
    </Stack.Navigator>
  );
};
export default Auth;
