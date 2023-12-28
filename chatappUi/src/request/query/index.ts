import { gql } from '@apollo/client';

export const getLoggedInUserDetailsQuery = gql`
  query {
    getLoggedInUserDetails {
      code
      message
      user {
        uuid
        username
        email
        avatarUrl
      }
    }
  }
`;

export const SearchQuery = gql`
 query($username: String) {
  searchUser(username: $username) {
    username
    avatarUrl
    uuid
  }
}
`;

export const SerchMessageUserQuery = gql`
  query ($text: String!) {
    SearchMessageUser(text: $text) {
      messageUser {
        uuid
        avatarUrl
        username
        details {
          fullName
        }
      }
      messageText {
        uuid
        text
        recipientUser {
          uuid
          username
          avatarUrl
        }
      }
      isUser
      isText
    }
  }
`;

export const UserInboxQuery = gql`
query UserInboxQuery {
  userInbox {
    error
    node {
      
      uuid
        username
        avatarUrl
        lastMessage
        InboxUuid
    }
  }
}
`;

export const MessageQuery = gql`
  query ($recipientUserUuid: ID!, $limit: Int, $offset: Int) {
    messages(
      recipientUserUuid: $recipientUserUuid
      limit: $limit
      offset: $offset
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
