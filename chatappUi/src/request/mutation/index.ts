import { gql } from '@apollo/client';

export const registerUserMutation = gql`
  mutation (
    $username: String!
    $password: String!
    $confirmPassword: String!
    $email: String!
    $DeviceToken: String!
  ) {
    registerUser(
      newUser: {
        username: $username
        password: $password
        confirmPassword: $confirmPassword
        email: $email
        DeviceToken: $DeviceToken
      }
    ) {
      code
      message
      token {
        token
      }
    }
  }
`;

export const signInUserMutation = gql`
  mutation (
    $email: String!
    $password: String!
    $DeviceToken: String!
  ) {
    signIn(
      sigInUser: {
        email: $email
        password: $password
        DeviceToken: $DeviceToken
      }
    ) {
      code
      message
      token {
        token
      }
    }
  }
`;
