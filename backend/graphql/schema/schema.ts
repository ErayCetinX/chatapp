const typeDefs = `#graphql
    scalar Date

    type User {
        uuid: ID!
        username: String!
        email: String!
        avatarUrl: String!
        InboxUuid: String
        lastMessage: String
        deviceToken: String!
        isVerifed: Boolean!
        isAdmin: Boolean! #sadece topluluklarda olacak
        isInvited: Boolean!
        isOnline: Boolean!
        createdAt: Date
    }

    type Message {
        uuid: ID!
        text: String
        senderUuid: ID!
        recipientUuid: ID!
        pictureUrl: String
        replyMessage: String
        replyMessagePictureUrl: String
        replyMessageUserUuid: ID
        isPicture: Boolean
        isReply: Boolean
        createdAt: Date

        #   reactions: [Reaction]
        senderUser: User!
        recipientUser: User!
    }

    type GroupChat {
        uuid: ID!
        groupName: String!
        ownerUserUuid: ID!
        OwnerUser: User! #tek user olcağı için array yapmadık
        description: String!
        groupAvatarUrl: String!

        Members: [User]! # grupa üye olanlar
        Message: [Message]!
    }

    type MessageInbox {
        uuid: ID!
        request: ID!
        accepting: ID!
    }

    type Inbox {
        node: [User]!
        error: String!
    }

    type Token {
        token: String!
    }

    type QueryMessage {
        messages: [Message!]!
        code: String!
        message: String!
    }

    type GroupChatEdge {
        group: [GroupChat!]!
        code: String!
        message: String!
    }

    type SearchGroupMessageEdge {
        messages: [Message!]!
        status: Boolean!
        message: String!
    }

    type UserMutationReturn {
        code: String!
        message: String!
        token: Token!
    }

    type MessageMutationReturn {
        code: String!
        message: String!
    }

    type MessageMutationReturn {
        Group: GroupChat!
        code: String!
        message: String!
    }
    
    type GetLoggedInUserDetails {
        user: User!
        code: String!
        message: String!
    }

    type GroupMutationReturn {
        groupChat: GroupChat!
        code: String!
        message: String!
    }

    type UserDetailsType {
        user: User!
        code: String!
        message: String!
    }

    type RetrunMessageBoxSatatus {
        node: [Message]
        status: Boolean!
        error: String!
    }

    type Query {
        getLoggedInUserDetails: GetLoggedInUserDetails!
        getUserDetailsByUuid(userUuid: ID!): UserDetailsType!
        getLoggedInUserGroups(limit: Int offset: Int): GroupChatEdge!
        getMessageForGroup(groupChatUuid: ID!, limit: Int, offset: Int): QueryMessage!
        searchGroupChat(groupChatName: String!): GroupChatEdge!
        searchGroupMessage(groupChatUuid: ID! searchMessage: String!): SearchGroupMessageEdge!
        searchUser(username: String): [User]!
        userInbox: Inbox!
        messages(recipientUserUuid: ID!, limit: Int, offset: Int): [Message]
    }

    type Mutation {
        #User Event
        registerUser(newUser: createUserInput!): UserMutationReturn!
        signIn(sigInUser: signinUserInput!): UserMutationReturn!

        #Message Event
        createMessage(newMessage: newMessageInput!): Message!
        ReplyMessage(replyMessage: ReplyMessageInput!): Message!
        deleteMessage(messageUuid: ID!): MessageMutationReturn!
        # Cache bağlı durum
        updateMessage(messageUuid: ID!): MessageMutationReturn!

        # GroupChat
        createGroupChat(newGroup: newGroupChatInput!): GroupMutationReturn!
        deleteGroupChat(groupChatUuid: ID!): GroupMutationReturn!
        joinGroupChat(groupChatUuid: ID!): GroupMutationReturn!
        leaveGroupChat(groupChatUuid: ID!): GroupMutationReturn!
        inviteGroupChat(userName: String! GroupChatUuid: ID!): GroupMutationReturn!

        CreateInbox(UserUuid: ID!): RetrunMessageBoxSatatus!
        DeleteInbox(InboxUuid: ID!): RetrunMessageBoxSatatus!
    }

    type Subscription {
        messageSent(userUuid: ID!): Message!
        newMessage(userUuid: ID!): Message!
        deleteMessage(userUuid: ID!): Message!
        userStatus: Boolean!
    }

    input createUserInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
        DeviceToken: String!
    }

    input ReplyMessageInput {
        recipientUserUuid: ID!
        MessageUuid: ID!
        text: String
        pictureUrl: String
        replyMessage: String
        replyMessagePicture: String
        replyMessageUser: ID
    }

    input signinUserInput {
        username: String!
        password: String!
        DeviceToken: String!
    }

    input newMessageInput {
        recipientUserUuid: ID!
        text: String
        pictureUrl: String
    }

    input newGroupChatInput {
        groupName: String!
        groupAvatar: String!
        description: String!
        userUuid: [ID!]!
    }
`;

export default typeDefs;
