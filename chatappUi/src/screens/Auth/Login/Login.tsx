import React, { useCallback, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import style from './LoginStyle';
import { Button, Icons } from '../../../components/ui';
import { useMutation } from '@apollo/client';
import { signInUserMutation } from '../../../request/mutation';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login:React.FC<{refetch:() => void}> = ({ refetch }) => {
  const navigation = useNavigation();
  const [signIn, { loading, error }] = useMutation(signInUserMutation);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const changeState = useCallback((e: string, type: 'Username' | 'Password') => {
    if (type === 'Username') {
      setUsername(e);
    }
    if (type === 'Password') {
      setPassword(e);
    }
  }, []);

  const getGreetingMessage = (): string => {
    const currentDate: Date = new Date();
    const currentHour: number = currentDate.getHours();

    let greetingMessage: string = '';

    if (currentHour >= 6 && currentHour < 12) {
      greetingMessage = 'Good Morning!';
    } else if (currentHour >= 12 && currentHour < 18) {
      greetingMessage = 'Good Afternoon!';
    } else {
      greetingMessage = 'Good Evening!';
    }

    return greetingMessage;
  };

  const loginPress = () => {
    signIn({
      variables: { username, password, DeviceToken: 'sad' },
    }).then(async ({ data }) => {
      const existTheme = await AsyncStorage.getItem('Theme');
      if (existTheme === null || existTheme === undefined) {
        await AsyncStorage.setItem('Theme', 'Light');
        await AsyncStorage.setItem('token', data.signIn.token.token);
        await refetch();
      } else {
        await AsyncStorage.setItem('token', data.signIn.token.token);
        await refetch();
      }
    });
  };

  return (
    <View style={style.container}>
      <View style={style.box}>
        <View style={style.message}>
          <Text style={{ fontSize: 25, fontWeight: '700' }}>
            {getGreetingMessage()}
          </Text>
          <View style={style.messageWelcome}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>
              Welcome back to chatapp
            </Text>
          </View>
        </View>
        {error?.name && (
          <View style={style.errorContainer}>
            <View style={style.errorBox}>
              <Text style={style.errorText}>{error?.message}</Text>
            </View>
          </View>
        )}
        <View style={style.content}>
          <View style={style.inputBox}>
            <Icons name="user" type="feather" size={25} color="#808080" />
            <TextInput
              style={style.input}
              autoCapitalize="none"
              autoComplete="username"
              keyboardType="default"
              value={username}
              onChangeText={e => changeState(e, 'Username')}
              placeholder="Username"
              placeholderTextColor={'#808080'}
              multiline={false}
              maxLength={70}
            />
          </View>
          <View style={style.inputBox}>
            <Icons name="lock" type="feather" color="#808080" />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={e => changeState(e, 'Password')}
              secureTextEntry={true}
              placeholderTextColor="#808080"
              autoCapitalize="none"
              style={style.input}
              maxLength={64}
              multiline={false}
            />
          </View>
          <Button style={style.button} onPress={loginPress}>
            <Text style={style.buttonText}>Login</Text>
          </Button>
        </View>
        <View style={style.info}>
          <Text style={style.infoText}>Don't have an account </Text>
          <Button
            disabled={loading}
            style={style.signUpButton}
            onPress={() => navigation.navigate('Register')}>
            <Text style={[style.infoText, style.signUpText]}>Sing up now</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Login;
