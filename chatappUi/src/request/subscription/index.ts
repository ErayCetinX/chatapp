const { gql } = require('@apollo/client');

export const MessageSub = gql`
  subscription ($userUuid: ID!) {
    newMessage(userUuid: $userUuid) {
      uuid
      recipientUuid
      senderUuid
      text
      pictureUrl
      isPicture
      replyMessage
      replyMessagePictureUrl
      replyMessageUserUuid
      isReply
      # senderUser {
      #   uuid
      # }
      createdAt
    }
  }
`;
