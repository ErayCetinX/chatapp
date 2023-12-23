import { AppRegistry, LogBox, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Apollo Settings
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import {
  getMainDefinition,
  offsetLimitPagination,
} from '@apollo/client/utilities';
import fetch from 'cross-fetch';
import { setContext } from '@apollo/client/link/context';
import { createClient } from 'graphql-ws';
// Redux
import { Provider } from 'react-redux';
import store from './src/redux/store';

// import PushNotification from 'react-native-push-notification';
// import messaging from '@react-native-firebase/messaging';

__DEV__ === false;

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

// Must be outside of any component LifeCycle (such as `componentDidMount`).
// PushNotification.configure({
//   // (optional) Called when Token is generated (iOS and Android)
//   onRegister: function (token) {
//     console.log('TOKEN:', token);
//   },

//   // (required) Called when a remote is received or opened, or local notification is opened
//   onNotification: function (notification) {
//     console.log('NOTIFICATION:', notification);

//     // process the notification

//     // (required) Called when a remote is received or opened, or local notification is opened
//   },

//   // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
//   onAction: function (notification) {
//     console.log('ACTION:', notification.action);
//     console.log('ACTNOTIFICATION:', notification);

//     // process the action
//   },

//   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//   onRegistrationError: function (err) {
//     console.error(err.message, err);
//   },

//   // Should the initial notification be popped automatically
//   // default: true
//   popInitialNotification: true,

//   /**
//    * (optional) default: true
//    * - Specified if permissions (ios) and token (android and ios) will requested or not,
//    * - if not, you must call PushNotificationsHandler.requestPermissions() later
//    * - if you are not using remote notification or do not have Firebase installed, use this:
//    *     requestPermissions:
//    */
//   requestPermissions: Platform.OS === 'ios',
// });

const Index = () => {
  const httpLink = new HttpLink({
    //Check current ip
    // Terminal => ipconfig
    // !! Don't use localhost
    uri: 'http://192.168.1.108:4000/api/v1/graphql',
    // uri: 'https://api.whoollyapp.com/graphql',
    fetch,
    credentials: 'include',
  });

  // Adds Authentication Headers on HTTP as well as was requests
  const authLink = setContext(async (_, { headers }) => {
    const token = await AsyncStorage.getItem('token');
    return {
      headers: {
        ...headers,
        authorization: token ? token : '',
      },
    };
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: 'ws://192.168.1.108:4000/api/v1/graphql',
      // url: 'wss://api.whoollyapp.com/graphql',
    }),
  );

  // WebSocket Link
  // const wsLink = new WebSocketLink(
  //   ur'ws://whoollyapp-backend.herokuapp.com/graphql/', {
  //     connectionParams: {
  //       authToken: user,
  //     },
  //     reconnect: true,
  //   }),
  // );

  // Send query request based on the type definition
  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(httpLink),
  );

  const client = new ApolloClient({
    ssrMode: true,
    link,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  );
};

// Register background handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

AppRegistry.registerComponent(appName, () => Index);
