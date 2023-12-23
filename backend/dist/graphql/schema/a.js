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

    type Query {
        UserInbox: Inbox!
        getMessageForGroup(GroupChatUuid: ID!, limit: Int, offset: Int): QueryMessage!
        getLoggedInUserDetails: GetLoggedInUserDetails!
        getUserDetailsByUuid(userUuid: ID!): User!
        getLoggedInUserGroups: [GroupChat!]!
        SearchGroup(GroupChatName: String!): GroupChatEdge!
        SearchGroupMessage(GroupChatUuid: ID! SearchMessage: String!): SearchGroupMessageEdge!
    }

    type Mutation {
        #User Event
        registerUser(newUser: createUserInput): UserMutationReturn!
        signIn(SigInUser: SigninUserInput!): UserMutationReturn!

        #Message Event
        createMessage(newMessage: newMessageInput!): MessageMutationReturn!
        deleteMessage(messageUuid: ID!): MessageMutation!
        updateMessage(messageUuid: ID!): MessageMutation!

        # GroupChat
        createGroupChat(newGroup: newGroupChatInput!): GroupMutationReturn!
        deleteGroupChat(GroupChatUuid: ID!): GroupMutationReturn!
        joinGroupChat(GroupChatUuid: ID!): GroupMutationReturn!
        leaveGroupChat(GroupChatUuid: ID!): GroupMutationReturn!
        inviteGroupChat(UserName: String! GroupChatUuid: ID!): GroupMutationReturn!
    }

    type Subscription {
        messageSent(userUuid: ID!): Message!
        deleteMessage(userUuid: ID!): Message!
    }

    input CreateUserInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
        DeviceToken: String!
    }
`;
exports.default = typeDefs;
