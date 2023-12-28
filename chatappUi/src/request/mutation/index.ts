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
    $username: String!
    $password: String!
    $DeviceToken: String!
  ) {
    signIn(
      sigInUser: {
        username: $username
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

export const CreateInboxMutation = gql`
  mutation ($UserUuid: ID!) {
    CreateInbox(UserUuid: $UserUuid) {
      node {
        uuid
        recipientUuid
        text
        senderUuid
      }
      status
      error
    }
  }
`;

export const MessageMutations = gql`
  mutation ($text: String, $recipientUserUuid: ID!, $pictureUrl: String) {
    createMessage(
      newMessage: {
        recipientUserUuid: $recipientUserUuid
        text: $text
        pictureUrl: $pictureUrl
      }
    ) {
      uuid
      recipientUuid
      senderUuid
      text
      pictureUrl
      replyMessage
      replyMessagePictureUrl
      replyMessageUserUuid
      isReply
      isPicture
      createdAt
    }
  }
`;

export const ReplyMessageMutation = gql`
  mutation (
    $MessageUuid: ID!
    $recipientUserUuid: ID!
    $replyMessage: String
    $replyMessagePicture: String
    $pictureUrl: String
    $text: String
  ) {
    ReplyMessage(
      replyMessage: {
        MessageUuid: $MessageUuid
        replyMessage: $replyMessage
        recipientUserUuid: $recipientUserUuid
        replyMessagePicture: $replyMessagePicture
        pictureUrl: $pictureUrl
        text: $text
      }
    ) {
      uuid
      recipientUuid
      senderUuid
      text
    }
  }
`;

export const DeleteInboxMutation = gql`
  mutation ($InboxUuid: ID!) {
    DeleteInbox(InboxUuid: $InboxUuid) {
      node {
        uuid
        recipientUuid
        senderUuid
        text
      }
      status
      error
    }
  }
`;
