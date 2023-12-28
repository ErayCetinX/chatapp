import React, { useCallback, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import style from './RegisterStyle';
import { Button, Icons } from '../../../components/ui';
import { useMutation } from '@apollo/client';
import { registerUserMutation } from '../../../request/mutation';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register: React.FC<{ refetch: () => void }> = ({ refetch }) => {
  const navigation = useNavigation();
  const [registerUser, { loading, error }] = useMutation(registerUserMutation);

  const [username, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');

  const changeState = useCallback(
    (e: string, type: 'Email' | 'Password' | 'repeatPassword' | 'username') => {
      if (type === 'Email') {
        setEmail(e);
      }
      if (type === 'Password') {
        setPassword(e);
      }
      if (type === 'repeatPassword') {
        setRepeatPassword(e);
      }
      if (type === 'username') {
        setUserName(e);
      }
    },
    [],
  );

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
    registerUser({
      variables: {
        username,
        confirmPassword: repeatPassword,
        email,
        password,
        DeviceToken: 'sad',
      },
    }).then(async ({ data }) => {
      await AsyncStorage.setItem('token', data.registerUser.token.token);
      await AsyncStorage.setItem('Theme', 'Light');
      await refetch();
    });
  };

  const isDisabled: boolean =
    loading === true ||
    username?.trim() === '' ||
    email?.trim() === '' ||
    password?.trim() === '' ||
    repeatPassword?.trim() === '' ||
    password?.length < 6 ||
    username?.length === 0 ||
    password?.length === 0 ||
    email?.length === 0 ||
    repeatPassword?.length === 0 ||
    password !== repeatPassword;

  return (
    <View style={style.container}>
      <View style={style.box}>
        <View style={style.message}>
          <Text style={{ fontSize: 25, fontWeight: '700' }}>
            {getGreetingMessage()}
          </Text>
          <View style={style.messageWelcome}>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>
              Discover and create awesome chat rooms
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
              autoComplete="name"
              keyboardType="default"
              value={username}
              onChangeText={e => changeState(e, 'username')}
              placeholder="Username"
              placeholderTextColor={'#808080'}
              multiline={false}
              maxLength={70}
            />
          </View>
          <View style={style.inputBox}>
            <Icons name="mail" type="feather" size={25} color="#808080" />
            <TextInput
              style={style.input}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={e => changeState(e, 'Email')}
              placeholder="Email"
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
          <View style={style.inputBox}>
            <Icons name="lock" type="feather" color="#808080" />
            <TextInput
              placeholder="Repeat Password"
              value={repeatPassword}
              onChangeText={e => changeState(e, 'repeatPassword')}
              secureTextEntry={true}
              placeholderTextColor="#808080"
              autoCapitalize="none"
              style={style.input}
              maxLength={64}
              multiline={false}
            />
          </View>
          <Button
            style={style.button}
            onPress={loginPress}
            disabled={isDisabled}>
            <Text style={style.buttonText}>Register</Text>
          </Button>
        </View>
        <View style={style.info}>
          <Text style={style.infoText}>Have an account </Text>
          <Button
            disabled={loading}
            style={style.loginButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={[style.infoText, style.loginText]}>Log in now</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Register;
