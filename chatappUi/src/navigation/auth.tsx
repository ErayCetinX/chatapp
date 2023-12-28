import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Auth/Login/Login';
import Register from '../screens/Auth/Register/Register';
// import ForgotPassword from '../screens/Auth/ForgotPassword/ForgotPassword';

const Auth:React.FC<{refetch: () => void}> = ({ refetch }) => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Register">
        {() => <Register refetch={refetch} />}
      </Stack.Screen>
      <Stack.Screen name="Login">
        {() => <Login refetch={refetch} />}
      </Stack.Screen>
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> */}
    </Stack.Navigator>
  );
};
export default Auth;
