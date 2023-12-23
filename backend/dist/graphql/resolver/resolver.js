"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub_1 = __importDefault(require("../../src/helpers/pubsub"));
const token_1 = __importDefault(require("../../src/helpers/token"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const resolvers = {
    Mutation: {
        registerUser: async (_, { newUser: { username, password, email, confirmPassword, DeviceToken } }, { prisma }) => {
            // Username check
            const accountname = await prisma.user.findUnique({
                where: {
                    username,
                },
            });
            // Email check
            const mail = await prisma.user.findUnique({
                where: {
                    email,
                },
            });
            // Hash the password with bcrypt
            const hashedPassword = await bcrypt_1.default.hash(password, 12);
            // İf there is no mail
            if (mail) {
                throw new Error("There is an account with this email address!");
            }
            // İf the entered password is less than 6
            if (password.length < 6) {
                throw new Error("Your password is less than 6");
            }
            // İf passwords are not equal
            if (password !== confirmPassword) {
                throw new Error("Passwords are not the same!!!");
            }
            // İf there is a accountname entered
            if (accountname) {
                throw new Error("This username has a Whoolly account");
            }
            // İf username is blank
            if (username.trim() === "") {
                throw new Error("Your name cannot be blank!!!");
            }
            // if password is blank
            if (password.trim() === "") {
                throw new Error("Your password cannot be empty!!!");
                // eslint-disable-next-line
            }
            // İf everything is true
            const newUser = await prisma.user.create({
                data: {
                    uuid: (0, uuid_1.v4)(),
                    username,
                    password: hashedPassword,
                    email,
                    avatarUrl: "https://res.cloudinary.com/mowight/image/upload/v1611737982/DefaultUser_mun1im.jpg",
                    deviceToken: DeviceToken,
                },
            });
            // Email gönderiliyor
            // sendMail(email, username);
            newUser.isOnline = true;
            return {
                token: {
                    token: token_1.default.generate(newUser, "1y"),
                },
                code: "200",
                message: "User creted"
            };
        },
        signIn: async (_, { sigInUser: { username, password, DeviceToken }, }, { prisma }) => {
            // Fristname is null
            if (username.trim() === "") {
                throw new Error("Your name cannot be blank");
            }
            // Password is null
            if (password.trim() === "") {
                throw new Error("Your password cannot be empty");
            }
            // User check
            const user = await prisma.user.findUnique({
                where: {
                    username,
                },
            });
            // İf there is no username
            if (!user) {
                throw new Error("There is no user with the name you entered!");
            }
            // Compare password
            const validPassword = await bcrypt_1.default.compare(password, user.password);
            if (!validPassword) {
                throw new Error("Invalid password, try again.");
                // eslint-disable-next-line
            }
            // İf everything is true
            else {
                // Kullanıcının DeviceToken güncelledik
                await prisma.user.update({
                    data: {
                        deviceToken: DeviceToken,
                    },
                    where: {
                        uuid: user.uuid,
                    },
                });
                pubsub_1.default.publish('USER_LOGIN', user);
                user.isOnline = true;
                return {
                    token: {
                        token: token_1.default.generate(user, "1y"),
                    },
                    code: "200",
                    message: "User creted"
                };
            }
        },
        createMessage: async (_, { newMessage: { recipientUserUuid, text, pictureUrl }, }, { prisma, getLoggedInUserDetails }) => {
            try {
                // İf no getLoggedInUserDetails
                if (!getLoggedInUserDetails) {
                    throw new Error("Oturum Açınız");
                }
                const loginedUser = await prisma.user.findUnique({
                    where: {
                        uuid: getLoggedInUserDetails.uuid,
                    },
                });
                // We define recipient
                const recipient = await prisma.user.findUnique({
                    where: { uuid: recipientUserUuid },
                });
                // İf no recipient
                if (!recipient) {
                    throw new Error("User not found");
                }
                else if (recipient.uuid === getLoggedInUserDetails.uuid) {
                    throw new Error("Kendine mesaj gönderemezsiniz!");
                }
                if (pictureUrl) {
                    const message = await prisma.message.create({
                        data: {
                            uuid: (0, uuid_1.v4)(),
                            senderUuid: getLoggedInUserDetails.uuid,
                            recipientUuid: recipientUserUuid,
                            text,
                            pictureUrl,
                            isPicture: true,
                            isReply: false,
                        },
                    });
                    if (message) {
                        const UserNoti = await prisma.notifications.create({
                            data: {
                                uuid: (0, uuid_1.v4)(),
                                content: `${getLoggedInUserDetails.username} sent you a message.`,
                                senderUuid: getLoggedInUserDetails.uuid,
                                recevierUuid: recipientUserUuid, // Alıcı
                            },
                        });
                        // if (
                        //   recipient.deviceToken !== null &&
                        //   recipient.deviceToken.length > 0
                        // ) {
                        //   admin.messaging().send({
                        //     notification: {
                        //       title: "Whoolly",
                        //       body: `${getLoggedInUserDetails.username} sent you a picture.`,
                        //     },
                        //     token: recipient.deviceToken,
                        //   });
                        // }
                        pubsub_1.default.publish("New Notifications", {
                            Notifications: UserNoti,
                        });
                    }
                    pubsub_1.default.publish("newMessage", {
                        newMessage: message,
                        getLoggedInUserDetails,
                    });
                    return message;
                }
                // İf empity text
                if (text.trim() === "") {
                    throw new Error("mesaj boş olamaz");
                }
                const message = await prisma.message.create({
                    data: {
                        uuid: (0, uuid_1.v4)(),
                        senderUuid: getLoggedInUserDetails.uuid,
                        recipientUuid: recipientUserUuid,
                        text,
                        pictureUrl: "",
                        isPicture: false,
                        isReply: false,
                    },
                });
                if (message) {
                    const UserNoti = await prisma.notifications.create({
                        data: {
                            uuid: (0, uuid_1.v4)(),
                            content: `${getLoggedInUserDetails.username} sent you a message.`,
                            senderUuid: getLoggedInUserDetails.uuid,
                            recevierUuid: recipientUserUuid, // Alıcı
                        },
                    });
                    // if (
                    //   recipient.deviceToken !== null &&
                    //   recipient.deviceToken.length > 0
                    // ) {
                    //   admin.messaging().send({
                    //     notification: {
                    //       title: "Whoolly",
                    //       body: `${getLoggedInUserDetails.username}: ${text}`,
                    //     },
                    //     token: recipient.deviceToken,
                    //   });
                    // }
                    pubsub_1.default.publish("New Notifications", {
                        Notifications: UserNoti,
                    });
                }
                pubsub_1.default.publish("newMessage", {
                    newMessage: message,
                });
                return message;
            }
            catch (error) {
                throw new Error(error);
            }
        },
        createGroupChat: async (_, { newGroup: { groupName, groupAvatar, description, userUuid } }, { prisma, getLoggedInUserDetails }) => {
            try {
                if (!getLoggedInUserDetails) {
                    return {
                        code: "401",
                        message: 'unauthorized',
                        groupChat: null,
                    };
                }
                const isUserExist = await prisma.user.findUnique({
                    where: {
                        uuid: getLoggedInUserDetails.uuid,
                    },
                });
                if (!isUserExist) {
                    return {
                        code: "404",
                        message: "user not found",
                        groupChat: null,
                    };
                }
                if (!(groupName.length > 0)) {
                    return {
                        code: "411",
                        message: "less than 0",
                        groupChat: null,
                    };
                }
                const groupChat = await prisma.groupChat.create({
                    data: {
                        uuid: (0, uuid_1.v4)(),
                        groupAvatarUrl: groupAvatar.length > 0 ? groupAvatar : "https://res.cloudinary.com/mowight/image/upload/v1620650903/download_y1llvc.png",
                        groupName,
                        description,
                        ownerUser: {
                            connect: { uuid: getLoggedInUserDetails.uuid },
                        },
                    }
                }).then((groupData) => {
                    userUuid.map(async (uuid) => {
                        await prisma.groupMember.create({
                            data: {
                                uuid: (0, uuid_1.v4)(),
                                member: {
                                    connect: { uuid }
                                },
                                groupChat: {
                                    connect: { uuid }
                                },
                                isAdmin: groupData.ownerUserUuid === getLoggedInUserDetails.uuid,
                                isOwner: groupData.ownerUserUuid === getLoggedInUserDetails.uuid,
                            }
                        });
                        const memberCount = await prisma.groupMember.findMany({
                            where: {
                                groupUuid: groupData.uuid,
                            },
                        });
                        await prisma.groupChat.update({
                            data: {
                                memberCount: memberCount.length
                            },
                            where: {
                                uuid: groupData.uuid,
                            },
                        });
                    });
                });
                return {
                    code: '200',
                    message: 'chat created',
                    groupChat,
                };
            }
            catch (error) {
                return {
                    code: '400',
                    message: `${error}`,
                    groupChat: null
                };
            }
        },
        deleteGroupChat: async (_, { groupChatUuid, }, { prisma, getLoggedInUserDetails }) => {
            try {
                if (!getLoggedInUserDetails) {
                    return {
                        code: "401",
                        message: "unauthorized",
                        groupChat: null
                    };
                }
                const groupChatIsDefinedBefore = await prisma.groupChat.findUnique({
                    where: {
                        uuid: groupChatUuid,
                    },
                });
                if (!groupChatIsDefinedBefore) {
                    return {
                        code: "404",
                        message: "group chat not found",
                        groupChat: null,
                    };
                }
                await prisma.groupChat.delete({
                    where: {
                        uuid: groupChatUuid,
                    },
                });
                return {
                    code: '200',
                    message: 'groupChat was deleted',
                    groupChat: null,
                };
            }
            catch (error) {
                return {
                    code: '400',
                    message: `${error}`,
                    groupChat: null,
                };
            }
        },
        joinGroupChat: async (_, { groupChatUuid }, { prisma, getLoggedInUserDetails }) => {
            try {
                if (!getLoggedInUserDetails) {
                    return {
                        code: '401',
                        message: 'unauthorized',
                        groupChat: null,
                    };
                }
                const isGroupChatDefinedBefore = await prisma.groupChat.findUnique({
                    where: {
                        uuid: groupChatUuid,
                    },
                });
                if (!isGroupChatDefinedBefore) {
                    return {
                        code: '404',
                        message: 'group chat not found',
                        groupChat: null,
                    };
                }
                const userMemberOfGroupChat = await prisma.groupMember.findMany({
                    where: {
                        uuid: groupChatUuid,
                        userUuid: getLoggedInUserDetails.uuid,
                    },
                });
                if (userMemberOfGroupChat.length > 0) {
                    return {
                        code: '406',
                        message: 'you member of this group',
                        groupChat: isGroupChatDefinedBefore,
                    };
                }
                await prisma.groupMember.create({
                    data: {
                        uuid: (0, uuid_1.v4)(),
                        groupChat: {
                            connect: {
                                uuid: groupChatUuid,
                            },
                        },
                        member: {
                            connect: {
                                uuid: getLoggedInUserDetails.uuid
                            },
                        },
                        isAdmin: false,
                        isOwner: false,
                    }
                });
                return {
                    code: '200',
                    message: 'you joined this group',
                    groupChat: isGroupChatDefinedBefore,
                };
            }
            catch (error) {
                return {
                    code: '400',
                    message: `${error}`,
                    groupChat: null,
                };
            }
        }
    },
    Query: {
        getLoggedInUserDetails: async (_, __, { prisma, getLoggedInUserDetails }) => {
            try {
                if (!getLoggedInUserDetails) {
                    return null;
                }
                const user = await prisma.user.findUnique({
                    where: {
                        uuid: getLoggedInUserDetails.uuid,
                    },
                });
                user.isOnline = getLoggedInUserDetails.isOnline;
                return {
                    code: "200",
                    message: 'Showing loggedInUserDetails',
                    user,
                };
            }
            catch (e) {
                throw new Error(e);
            }
        },
    },
    Subscription: {
        // BURADA CLIENT KISMINDA ON CONNECTED YAP 
        // BURADAKİ SUBS QUERY SİL 
        userStatus: {
            subscribe: (0, graphql_subscriptions_1.withFilter)(() => pubsub_1.default.asyncIterator('USER_LOGIN'), (payload, variables) => {
                // Only push an update if the comment is on
                // the correct repository for this operation
                return true;
            }),
        }
    }
};
exports.default = resolvers;
//# sourceMappingURL=resolver.js.map