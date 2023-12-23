"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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

        # reactions: [Reaction]
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
        Group: [GroupChat!]!
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

    type Query {
        userInbox: Inbox!
        getMessageForGroup(groupChatUuid: ID!, limit: Int, offset: Int): QueryMessage!
        getLoggedInUserDetails: GetLoggedInUserDetails!
        getUserDetailsByUuid(userUuid: ID!): User!
        getLoggedInUserGroups: [GroupChat!]!
        searchGroupChat(groupChatName: String!): GroupChatEdge!
        searchGroupMessage(groupChatUuid: ID! searchMessage: String!): SearchGroupMessageEdge!
    }

    type Mutation {
        #User Event
        registerUser(newUser: createUserInput): UserMutationReturn!
        signIn(sigInUser: signinUserInput!): UserMutationReturn!

        #Message Event
        createMessage(newMessage: newMessageInput!): MessageMutationReturn!
        deleteMessage(messageUuid: ID!): MessageMutationReturn!
        updateMessage(messageUuid: ID!): MessageMutationReturn!

        # GroupChat
        createGroupChat(newGroup: newGroupChatInput!): GroupMutationReturn!
        deleteGroupChat(groupChatUuid: ID!): GroupMutationReturn!
        joinGroupChat(groupChatUuid: ID!): GroupMutationReturn!
        leaveGroupChat(groupChatUuid: ID!): GroupMutationReturn!
        inviteGroupChat(userName: String! GroupChatUuid: ID!): GroupMutationReturn!
    }

    type Subscription {
        messageSent(userUuid: ID!): Message!
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
exports.default = typeDefs;
//# sourceMappingURL=schema.js.map