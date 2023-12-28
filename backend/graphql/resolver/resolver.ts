import { Context } from "../../context";
import pubsub from "../../src/helpers/pubsub";
import token from "../../src/helpers/token";

import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { withFilter } from "graphql-subscriptions";
import { redis } from "../../redis";

import { IUser } from "../../src/types/user";

const resolvers = {
  Mutation: {
    async ReplyMessage(
      _: unknown,
      {
        replyMessage: { MessageUuid, recipientUserUuid, pictureUrl, text },
      }: {
        replyMessage: {
          MessageUuid: string;
          recipientUserUuid: string;
          pictureUrl: string;
          text: string;
        };
      },
      { getLoggedInUserDetails, prisma }: Context
    ) {
      // İf no getLoggedInUserDetails
      if (!getLoggedInUserDetails) {
        throw new Error("Oturum Açınız");
      }

      const messages = await prisma.message.findUnique({
        where: {
          uuid: MessageUuid,
        },
      });

      // We define recipient
      const recipient = await prisma.user.findUnique({
        where: { uuid: recipientUserUuid },
      });

      // İf no recipient
      if (!recipient) {
        throw new Error("User not found");
      } else if (recipient.uuid === getLoggedInUserDetails.uuid) {
        throw new Error("Kendine mesaj gönderemezsiniz!");
      }

      if (!messages) {
        throw new Error("Message not found");
      }

      // Eğer yanıtlanan resim ise
      if (pictureUrl) {
        const message = await prisma.message.create({
          data: {
            uuid: v4(),
            senderUuid: getLoggedInUserDetails.uuid,
            recipientUuid: recipientUserUuid,
            text,
            pictureUrl,
            replyMessagePictureUrl:
              messages && messages.pictureUrl ? messages.pictureUrl : "",
            replyMessage: messages && messages.text ? messages.text : "",
            replyMessageUserUuid:
              messages && messages.senderUuid ? messages.senderUuid : "",
            isPicture: true,
            isReply: true,
          },
        });

        if (message) {
          const UserNoti = await prisma.notifications.create({
            data: {
              uuid: v4(),
              content: `${getLoggedInUserDetails.username} sent you a message.`,
              senderUuid: getLoggedInUserDetails.uuid, // Gönderen
              recevierUuid: recipientUserUuid, // Alıcı
            },
          });

          pubsub.publish("New Notifications", {
            Notifications: UserNoti,
          });

          // await User.update(
          //   { user_notifications: Sequelize.literal('user_notifications + 1'), },
          //   { where: { uuid: recipientUserUuid, }, }
          // );
        }

        pubsub.publish("newMessage", {
          newMessage: message,
          getLoggedInUserDetails,
        });

        return message;
      }

      // // if empity text
      // if (text.trim() === '') {
      //   throw new UserInputError('mesaj boş olamaz');
      // }

      const message = await prisma.message.create({
        data: {
          uuid: v4(),
          senderUuid: getLoggedInUserDetails.uuid,
          recipientUuid: recipientUserUuid,
          text,
          pictureUrl: "",
          replyMessagePictureUrl:
            messages && messages.pictureUrl ? messages.pictureUrl : "",
          replyMessage: messages && messages.text ? messages.text : "",
          replyMessageUserUuid:
            messages && messages.senderUuid ? messages.senderUuid : "",
          isPicture: false,
          isReply: true,
        },
      });

      if (message) {
        const UserNoti = await prisma.notifications.create({
          data: {
            uuid: v4(),
            content: `${getLoggedInUserDetails.username} sent you a message.`,
            senderUuid: getLoggedInUserDetails.uuid, // Gönderen
            recevierUuid: recipientUserUuid, // Alıcı
          },
        });

        pubsub.publish("New Notifications", {
          Notifications: UserNoti,
        });

        // await User.update(
        //   { user_notifications: Sequelize.literal('user_notifications + 1'), },
        //   { where: { uuid: recipientUserUuid, }, }
        // );
      }

      pubsub.publish("newMessage", {
        newMessage: message,
        getLoggedInUserDetails,
      });

      return message;
    },
    async CreateInbox(
      _: unknown,
      { UserUuid }: { UserUuid: string },
      { getLoggedInUserDetails, prisma }: Context
    ) {
      try {
        const users: IUser = await prisma.user.findUnique({
          where: {
            uuid: UserUuid,
          },
        });

        if (!users) {
          return {
            node: [],
            status: false,
            error: "User not found",
          };
        }

        if (getLoggedInUserDetails.uuid === UserUuid) {
          return {
            status: false,
            error: "You cannot open a message box with yourself",
          };
        }

        const userUuid = [getLoggedInUserDetails.uuid, users.uuid];

        const userMessageBoxCacheKey = `messageBox: ${getLoggedInUserDetails.uuid}`;
        const pipeline = await redis.pipeline();

        const existBefore = await prisma.messageBox.findMany({
          where: {
            request: { in: userUuid },
            accepting: { in: userUuid },
          },
        });

        // Eğer böyle bir Inbox varsa mesajları göster
        if (existBefore.length > 0) {
          // Burada mesajları aldık
          const messages = await prisma.message.findMany({
            where: {
              senderUuid: { in: userUuid },
              recipientUuid: { in: userUuid },
            },
            orderBy: { createdAt: "desc" },
          });

          // Return ile verdik
          return {
            node: messages,
            status: true,
            error: "No Error, showing messages",
          };
        }

        // Eğer böyle bir Inbox yoksa
        // yani existBefore === false
        const messageBox = await prisma.messageBox.create({
          data: {
            uuid: v4(),
            request: getLoggedInUserDetails.uuid,
            accepting: UserUuid,
          },
        });

        users.InboxUuid = messageBox.uuid;

        // Cache'e veri eklemek için kullanılan komutlar
        pipeline.lpush(userMessageBoxCacheKey, JSON.stringify(users));
        pipeline.expire(userMessageBoxCacheKey, 300); // 5 dakika süreyle cache'te tutulacak
        pipeline.exec();

        // Daha önce veri olmadığı için boş array vereceğiz
        return {
          node: [],
          status: true,
          error: "",
        };
      } catch (error) {
        return {
          status: false,
          error: `${error}`,
        };
      }
    },
    async DeleteInbox(
      _: unknown,
      { InboxUuid }: { InboxUuid: string },
      { prisma, getLoggedInUserDetails }: Context
    ) {
      try {
        const existBefore = await prisma.messageBox.findUnique({
          where: {
            uuid: InboxUuid,
          },
        });

        // Not found inbox
        if (!existBefore) {
          return {
            status: false,
            error: "Inbox not found.",
          };
        }

        // Eğerki inbox varsa mesajlar silenecek ve inbox silinecek

        const user = [existBefore.request, existBefore.accepting];

        // Mesajları silmeye gerek yok tekrar açılırsa mesajlar gözüksün
        // await Message.destroy({
        //   where: {
        //     from: { [Op.in]: user },
        //     to: { [Op.in]: user },
        //   },
        //   truncate: true,
        // });

        const userMessageBoxCacheKey = `messageBox: ${getLoggedInUserDetails.uuid}`;
        // await redis.del(userMessageBoxCacheKey);
        const userMessageBox = await redis.lrange(
          userMessageBoxCacheKey,
          0,
          -1
        );
        const allMessage = userMessageBox.map((d) => JSON.parse(d));

        if (allMessage.length > 0) {
          const multi = redis.multi(); // multi komutunu burada çalıştırıyoruz

          allMessage.forEach(async (user) => {
            await multi.lrem(userMessageBoxCacheKey, 0, JSON.stringify(user));

            await prisma.messageBox.delete({
              where: {
                uuid: InboxUuid,
              },
            });
          });

          await multi.exec();
          return {
            status: true,
            error: "",
          };
        }

        console.log(InboxUuid);
        // destroy Inbox
        await prisma.messageBox.delete({
          where: {
            uuid: InboxUuid,
          },
        });

        return {
          status: true,
          error: "",
        };
      } catch (error) {
        return {
          status: false,
          error,
        };
      }
    },
    registerUser: async (
      _: any,
      { newUser: { username, password, email, confirmPassword, DeviceToken } },
      { prisma }: Context
    ) => {
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
      const hashedPassword = await bcrypt.hash(password, 12);

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

      const newUser: IUser = await prisma.user.create({
        data: {
          uuid: v4(),
          username,
          password: hashedPassword,
          email,
          avatarUrl:
            "https://res.cloudinary.com/mowight/image/upload/v1611737982/DefaultUser_mun1im.jpg",
          deviceToken: DeviceToken,
        },
      });

      // Email gönderiliyor
      // sendMail(email, username);

      newUser.isOnline = true;

      return {
        token: {
          token: token.generate(newUser, "1y"),
        },
        code: "200",
        message: "User creted",
      };
    },
    signIn: async (
      _: unknown,
      {
        sigInUser: { username, password, DeviceToken },
      }: {
        sigInUser: { username: string; password: string; DeviceToken: string };
      },
      { prisma }: Context
    ) => {
      // Fristname is null
      if (username.trim() === "") {
        throw new Error("Your username cannot be blank");
      }

      // Password is null
      if (password.trim() === "") {
        throw new Error("Your password cannot be empty");
      }

      // User check
      const user: IUser = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      // İf there is no username
      if (!user) {
        throw new Error("There is no user with the username you entered!");
      }

      // Compare password
      const validPassword = await bcrypt.compare(password, user.password);

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

        pubsub.publish("USER_LOGIN", user);
        user.isOnline = true;

        return {
          token: {
            token: token.generate(user, "1y"),
          },
          code: "200",
          message: "User creted",
        };
      }
    },
    async createMessage(
      _: unknown,
      {
        newMessage: { recipientUserUuid, text, pictureUrl },
      }: {
        newMessage: {
          recipientUserUuid: string;
          text: string;
          pictureUrl: string;
        };
      },
      { prisma, getLoggedInUserDetails }: Context
    ) {
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
        } else if (recipient.uuid === getLoggedInUserDetails.uuid) {
          throw new Error("Kendine mesaj gönderemezsiniz!");
        }

        // İf empity text
        if (text.trim() === "") {
          throw new Error("mesaj boş olamaz");
        }

        const message = await prisma.message.create({
          data: {
            uuid: v4(),
            senderUuid: getLoggedInUserDetails.uuid,
            recipientUuid: recipientUserUuid,
            text,
            pictureUrl: "",
            isPicture: false,
            isReply: false,
          },
        });

        pubsub.publish("newMessage", {
          newMessage: message,
        });

        return message;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    deleteMessage: async (
      _: any,
      { groupChatUuid }: { groupChatUuid: string },
      { prisma, getLoggedInUserDetails }: Context
    ) => {
      try {
        if (!getLoggedInUserDetails) {
          return {
            code: "401",
            message: "unauthorized",
            groupChat: [],
          };
        }

        const isGroupChatDefinedBefore = await prisma.groupChat.findUnique({
          where: {
            uuid: groupChatUuid,
          },
        });

        if (!isGroupChatDefinedBefore) {
          return {
            code: "404",
            message: "group not found",
            groupChat: [],
          };
        }

        // !! BURADA TÜM USERLAR SİLİNİYOR MU DİYE CHECK ET
        // !! YANİ İLİŞKİLENDİRME YOKSA EKLE OLMADI FOR LOOP İLE SİL

        await prisma.groupChat.delete({
          where: {
            uuid: groupChatUuid,
          },
        });

        return {
          code: "200",
          message: "Deleted",
          groupChat: isGroupChatDefinedBefore,
        };
      } catch (error) {
        return {
          code: "400",
          message: `${error}`,
          groupChat: [],
        };
      }
    },
    createGroupChat: async (
      _: any,
      {
        newGroup: { groupName, groupAvatar, description, userUuid },
      }: {
        newGroup: {
          groupName: string;
          groupAvatar: string;
          description: string;
          userUuid: string[];
        };
      },
      { prisma, getLoggedInUserDetails }: Context
    ) => {
      try {
        if (!getLoggedInUserDetails) {
          return {
            code: "401",
            message: "unauthorized",
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

        const groupChat = await prisma.groupChat
          .create({
            data: {
              uuid: v4(),
              groupAvatarUrl:
                groupAvatar.length > 0
                  ? groupAvatar
                  : "https://res.cloudinary.com/mowight/image/upload/v1620650903/download_y1llvc.png",
              groupName,
              description,
              ownerUserUuid: getLoggedInUserDetails.uuid,
            },
          })
          .then((groupData) => {
            userUuid.map(async (uuid: string) => {
              await prisma.groupMember.create({
                data: {
                  uuid: v4(),
                  member: {
                    connect: { uuid },
                  },
                  groupChat: {
                    connect: { uuid },
                  },
                  isAdmin:
                    groupData.ownerUserUuid === getLoggedInUserDetails.uuid,
                },
              });

              const memberCount = await prisma.groupMember.findMany({
                where: {
                  groupUuid: groupData.uuid,
                },
              });

              await prisma.groupChat.update({
                data: {
                  memberCount: memberCount.length,
                },
                where: {
                  uuid: groupData.uuid,
                },
              });
            });
          });

        return {
          code: "200",
          message: "chat created",
          groupChat,
        };
      } catch (error) {
        return {
          code: "400",
          message: `${error}`,
          groupChat: null,
        };
      }
    },
    deleteGroupChat: async (
      _: any,
      { groupChatUuid }: { groupChatUuid: string },
      { prisma, getLoggedInUserDetails }: Context
    ) => {
      try {
        if (!getLoggedInUserDetails) {
          return {
            code: "401",
            message: "unauthorized",
            groupChat: null,
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
          code: "200",
          message: "groupChat was deleted",
          groupChat: null,
        };
      } catch (error) {
        return {
          code: "400",
          message: `${error}`,
          groupChat: null,
        };
      }
    },
    joinGroupChat: async (
      _: any,
      { groupChatUuid }: { groupChatUuid: string },
      { prisma, getLoggedInUserDetails }: Context
    ) => {
      try {
        if (!getLoggedInUserDetails) {
          return {
            code: "401",
            message: "unauthorized",
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
            code: "404",
            message: "group chat not found",
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
            code: "406",
            message: "you member of this group",
            groupChat: isGroupChatDefinedBefore,
          };
        }

        await prisma.groupMember.create({
          data: {
            uuid: v4(),
            groupChat: {
              connect: {
                uuid: groupChatUuid,
              },
            },
            member: {
              connect: {
                uuid: getLoggedInUserDetails.uuid,
              },
            },
            isAdmin: false,
          },
        });

        return {
          code: "200",
          message: "you joined this group",
          groupChat: isGroupChatDefinedBefore,
        };
      } catch (error) {
        return {
          code: "400",
          message: `${error}`,
          groupChat: null,
        };
      }
    },
    leaveGroupChat: async (
      _: any,
      { groupChatUuid }: { groupChatUuid: string },
      { prisma, getLoggedInUserDetails }: Context
    ) => {
      try {
        if (!getLoggedInUserDetails) {
          return {
            code: "401",
            message: "unauthorized",
            groupChat: null,
          };
        }

        const isGroupChatDefinedBefore = await prisma.groupChat.findUnique({
          where: {
            uuid: groupChatUuid,
          },
        });

        // Grup yoksa error vercek
        if (!isGroupChatDefinedBefore) {
          return {
            code: "404",
            message: "group chat not found",
            groupChat: null,
          };
        }

        // Memberı al
        const UserMember = await prisma.groupMember.findMany({
          where: {
            groupUuid: groupChatUuid,
          },
        });

        if (UserMember.length > 1) {
          UserMember.map(async (data) => {
            if (data.userUuid === getLoggedInUserDetails.uuid) {
              if (data.isAdmin === true) {
                // Owner sildik
                const groupChatOfMember = await prisma.groupMember.findMany({
                  where: {
                    groupUuid: groupChatUuid,
                    userUuid: getLoggedInUserDetails.uuid,
                  },
                  select: {
                    uuid: true,
                  },
                });

                await prisma.groupMember.delete({
                  where: {
                    uuid: groupChatOfMember[0].uuid,
                  },
                });

                const groupMemberLength = await prisma.groupMember.findMany({
                  where: {
                    groupUuid: groupChatUuid,
                  },
                });

                // Sayıyı azalttık
                await prisma.groupChat.update({
                  data: {
                    memberCount: groupMemberLength.length,
                  },
                  where: {
                    uuid: groupChatUuid,
                  },
                });

                // Eğer admin sayısı 1 ise en eski kullanıcı admin ve owner olcak
                if (isGroupChatDefinedBefore.memberCount === 1) {
                  // Burada en eski kullanıcı owner olacak
                  const Members = await prisma.groupMember.findMany({
                    where: {
                      groupUuid: groupChatUuid,
                    },
                    orderBy: { createdAt: "asc" },
                  });

                  // Yeni owner ataması
                  await prisma.groupChat.update({
                    data: {
                      ownerUserUuid: Members[0].userUuid,
                    },
                    where: {
                      uuid: groupChatUuid,
                    },
                  });

                  await prisma.groupMember.update({
                    data: {
                      isAdmin: true,
                    },
                    where: {
                      uuid: Members[0].uuid,
                    },
                  });

                  // Eski owner gönderdiği bildirimleri silicez
                  await prisma.notifications.deleteMany({
                    where: {
                      senderUuid: getLoggedInUserDetails.uuid, // Gönderen
                    },
                  });

                  return {
                    code: "200",
                    message: "Leaving",
                    groupChat: null,
                  };
                }

                // Burada en eski admin owner olacak
                const AdminMembers = await prisma.groupMember.findMany({
                  where: {
                    groupUuid: groupChatUuid,
                    isAdmin: true,
                  },
                  orderBy: { createdAt: "asc" },
                });

                // Yeni owner ataması
                await prisma.groupChat.update({
                  data: {
                    ownerUserUuid: AdminMembers[0].userUuid,
                  },
                  where: {
                    uuid: groupChatUuid,
                  },
                });

                return {
                  status: true,
                  error: "No error",
                };
              }

              await prisma.groupMember.deleteMany({
                where: {
                  groupUuid: groupChatUuid,
                  userUuid: getLoggedInUserDetails.uuid,
                },
              });

              const communityMemberLength = await prisma.groupMember.findMany({
                where: {
                  groupUuid: groupChatUuid,
                },
              });

              await prisma.groupChat.update({
                data: {
                  memberCount: communityMemberLength.length,
                },
                where: {
                  uuid: groupChatUuid,
                },
              });

              // Kullanıcının topluluğa girerken attığı bildirimi silip sonra tekrar ayrıldı bildirimi atıcaz
              await prisma.notifications.deleteMany({
                where: {
                  senderUuid: getLoggedInUserDetails.uuid,
                  recevierUuid: isGroupChatDefinedBefore.ownerUserUuid,
                },
              });

              await prisma.notifications.create({
                data: {
                  uuid: v4(),
                  content: "Member leave community",
                  senderUuid: getLoggedInUserDetails.uuid,
                  recevierUuid: isGroupChatDefinedBefore.ownerUserUuid,
                  groupUuid: groupChatUuid,
                },
              });

              return {
                code: "200",
                message: "leaving",
                groupChat: null,
              };
            }

            return {
              code: "200",
              message: "You are not member of this group",
              groupChat: null,
            };
          });
        }

        // Sadece 1 tane member varsa direkt topluluk silinecek
        if (UserMember.length === 1) {
          await prisma.groupChat.delete({
            where: {
              uuid: groupChatUuid,
            },
          });

          return {
            status: true,
            error: "No error",
          };
        }
      } catch (error) {
        return {
          code: "400",
          message: `${error}`,
          groupChat: null,
        };
      }
    },
  },
  Query: {
    async userInbox(
      _: unknown,
      __: unknown,
      { prisma, getLoggedInUserDetails }: Context
    ) {
      if (!getLoggedInUserDetails) {
        return {
          node: [],
          error: "Unauthenticated",
        };
      }

      // Let InboxUuid;
      const userMessageBoxCacheKey = `messageBox: ${getLoggedInUserDetails.uuid}`;
      // await redis.del(userMessageBoxCacheKey);
      const userMessageBox = await redis.lrange(userMessageBoxCacheKey, 0, -1);
      console.log(userMessageBox);

      if (userMessageBox.length === 0) {
        // !! burada en son mesaja göre ayarlar
        const UsersInbox = await prisma.messageBox.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });

        const pipeline = await redis.pipeline();

        const node = await UsersInbox.map(
          async (UserInbox: {
            request: string;
            accepting: string;
            uuid: string;
          }) => {
            // Const possible = [UserInbox.accepting, getLoggedInUserDetails.uuid];
            // const possibleI = [UserInbox.accepting, getLoggedInUserDetails.uuid];

            // Inbox uuid almak için basit bir sistem
            // InboxUuid = UserInbox.uuid;

            if (getLoggedInUserDetails.uuid === UserInbox.request) {
              const users: IUser[] | any[] = await prisma.user.findMany({
                where: {
                  uuid: UserInbox.accepting,
                },
              });

              for (let index = 0; index < users.length; index += 1) {
                const user: IUser = users[index];
                // Console.log(user);
                user.InboxUuid = UserInbox.uuid;
                const userUuid = [
                  UserInbox.accepting,
                  getLoggedInUserDetails.uuid,
                ];
                const messages = await prisma.message.findMany({
                  where: {
                    senderUuid: {
                      in: userUuid,
                    },
                    recipientUuid: {
                      in: userUuid,
                    },
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                });
                console.log("first", messages);

                if (messages.length === 0) {
                  user.lastMessage = "";

                  pipeline.lpush(userMessageBoxCacheKey, JSON.stringify(user));
                  return user;
                } else {
                  user.lastMessage = messages[0].text;

                  pipeline.lpush(userMessageBoxCacheKey, JSON.stringify(user));
                  return user;
                }
              }
            }

            if (getLoggedInUserDetails.uuid === UserInbox.accepting) {
              const users: IUser[] | any[] = await prisma.user.findMany({
                where: {
                  uuid: UserInbox.request,
                },
              });

              for (let index = 0; index < users.length; index += 1) {
                const user: IUser = users[index];
                // Console.log(user);
                user.InboxUuid = UserInbox.uuid;

                const userUuid = [
                  UserInbox.request,
                  getLoggedInUserDetails.uuid,
                ];

                const messages = await prisma.message.findMany({
                  where: {
                    senderUuid: {
                      in: userUuid,
                    },
                    recipientUuid: {
                      in: userUuid,
                    },
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                });

                if (messages[0] === null) {
                  user.lastMessage = "";

                  pipeline.lpush(userMessageBoxCacheKey, JSON.stringify(user));
                  return user;
                }

                user.lastMessage = messages[0].text;

                pipeline.lpush(userMessageBoxCacheKey, JSON.stringify(user));
                return user;
              }
            } else {
              return [];
            }
            // Console.log(users);
          }
        );

        await Promise.all(node); // Beklemek için Promise.all kullanılır.

        await pipeline.expire(userMessageBoxCacheKey, 300);
        await pipeline.exec();

        return {
          node: node,
          error: "No error",
        };
      } else {
        const node = userMessageBox.map((messageBox) => {
          return JSON.parse(messageBox);
        });
        return {
          node,
          error: "No error",
        };
      }
    },
    getLoggedInUserDetails: async (
      _: unknown,
      __: unknown,
      { prisma, getLoggedInUserDetails }: Context
    ) => {
      try {
        if (!getLoggedInUserDetails) {
          return null;
        }

        const user: IUser = await prisma.user.findUnique({
          where: {
            uuid: getLoggedInUserDetails.uuid,
          },
        });

        user.isOnline = getLoggedInUserDetails.isOnline;

        return {
          code: "200",
          message: "Showing loggedInUserDetails",
          user,
        };
      } catch (e: any) {
        throw new Error(e);
      }
    },
    getUserDetailsByUuid: async (
      _: unknown,
      { userUuid }: { userUuid: string },
      { prisma, getLoggedInUserDetails }: Context
    ) => {
      try {
        if (!getLoggedInUserDetails) {
          return {
            code: "401",
            message: "unauthorized",
            user: null,
          };
        }

        const getUser = await prisma.user.findUnique({
          where: {
            uuid: userUuid,
          },
        });

        if (!getUser) {
          return {
            code: "404",
            message: "user not found",
            user: null,
          };
        }

        return {
          code: "200",
          message: "showing",
          user: getUser,
        };
      } catch (error) {
        return {
          code: "400",
          message: `${error}`,
          user: null,
        };
      }
    },
    getLoggedInUserGroups: async (
      _: unknown,
      { limit, offset }: { limit: number; offset: number },
      { prisma, getLoggedInUserDetails }: Context
    ) => {
      try {
        if (!getLoggedInUserDetails) {
          return {
            code: "401",
            message: "unauthorized",
            group: [],
          };
        }

        const userMemberOfGroupChat = await prisma.groupMember.findMany({
          where: {
            userUuid: getLoggedInUserDetails.uuid,
          },
          take: limit,
          skip: offset,
        });

        if (userMemberOfGroupChat.length === 0) {
          return {
            code: "200",
            message: "You have not joined any group",
            group: [],
          };
        }

        const userGroup = userMemberOfGroupChat.map(
          async (UserMemeber: { groupUuid: string }) => {
            const joinedGroup = await prisma.groupChat.findMany({
              where: {
                uuid: UserMemeber.groupUuid,
              },
            });

            for (let index = 0; index < joinedGroup.length; index += 1) {
              const element = joinedGroup[index];
              return element;
            }
          }
        );
        return {
          code: "200",
          message: "Showing",
          group: userGroup,
        };
      } catch (error) {
        return {
          code: "400",
          message: `${error}`,
          group: [],
        };
      }
    },
    async messages(
      _: unknown,
      {
        recipientUserUuid,
        limit,
        offset,
      }: { recipientUserUuid: string; limit: number; offset: number },
      { prisma, getLoggedInUserDetails }: Context
    ) {
      try {
        if (!getLoggedInUserDetails) {
          throw new Error("Unauthenticated");
        }

        const user = await prisma.user.findUnique({
          where: {
            uuid: recipientUserUuid,
          },
        });
        if (!user) {
          throw new Error("User not found");
        }

        const userUuid = [user.uuid, getLoggedInUserDetails.uuid];

        return await prisma.message.findMany({
          where: {
            senderUuid: {
              in: userUuid,
            },
            recipientUuid: {
              in: userUuid,
            },
          },
          take: limit,
          skip: offset,
          orderBy: {
            createdAt: "desc",
          },
          // İnclude: [{model: Reaction, as: 'reactions'}],
        });
      } catch (error: any) {
        throw new Error(error);
      }
    },
    getMessageForGroup: async (
      _: unknown,
      {
        groupChatUuid,
        limit,
        offset,
      }: { groupChatUuid: string; limit: number; offset: number },
      { prisma, getLoggedInUserDetails }: Context
    ) => {
      try {
        if (!getLoggedInUserDetails) {
          return {
            code: "401",
            message: "unauthorized",
            messages: [],
          };
        }

        const isGroupChatDefinedBefore = await prisma.groupChat.findUnique({
          where: {
            uuid: groupChatUuid,
          },
        });

        if (!isGroupChatDefinedBefore) {
          return {
            code: "404",
            message: "group not found",
            messages: [],
          };
        }

        const groupMessage = await prisma.message.findMany({
          where: {
            groupChatUuid,
          },
          skip: offset,
          take: limit,
        });

        const messages = groupMessage.map((message) => message);

        return {
          code: "200",
          message: "Message showing",
          messages,
        };
      } catch (error) {
        return {
          code: "400",
          message: `${error}`,
          messages: [],
        };
      }
    },
    searchUser: async (
      _: unknown,
      { username }: { username: string },
      { prisma }: Context
    ) => {
      try {
        // İf only full_name

        // İf only Username
        if (username) {
          // İf Username is null
          if (username.trim() === "") {
            return "";
          }

          // İf Username is not null
          const user: IUser[] = await prisma.user.findMany({
            where: {
              // Op.like mysql Like komutu demek
              // Username den gelen veri ile user db de arama yapıyor
              // e ile ilgili veri girdiyse db de Username'in içinde  e olan olan tüm kullanıcıları getiriyor
              username: {
                contains: username,
                mode: "insensitive",
              },
            },
            take: 4,
          });

          return user.map(async (SearchedUser) => SearchedUser);
        }

        return true;
      } catch (error: any) {
        throw new Error(error);
      }
    },
    searchGroupChat: async (
      _: unknown,
      { groupChatName }: { groupChatName: string },
      { prisma, getLoggedInUserDetails }: Context
    ) => {
      try {
        if (!getLoggedInUserDetails) {
          return {
            code: "401",
            message: "unauthorized",
            group: [],
          };
        }

        const groups = await prisma.groupChat.findMany({
          where: {
            groupName: {
              contains: groupChatName,
              mode: "insensitive",
            },
          },
          select: {
            description: true,
            groupAvatarUrl: true,
            groupName: true,
            memberCount: true,
          },
        });

        const group = groups.map((grp) => grp);
        return {
          code: "200",
          message: "Showing search result",
          group,
        };
      } catch (error) {
        return {
          code: "400",
          message: `${error}`,
          group: [],
        };
      }
    },
    searchGroupMessage: async (
      _: unknown,
      {
        groupChatUuid,
        searchMessage,
      }: { groupChatUuid: string; searchMessage: string },
      { prisma, getLoggedInUserDetails }: Context
    ) => {
      try {
        if (!getLoggedInUserDetails) {
          return {
            code: "401",
            message: "unauthorized",
            messages: [],
          };
        }

        const isGroupChatDefinedBefore = await prisma.groupChat.findUnique({
          where: {
            uuid: groupChatUuid,
          },
        });

        if (!isGroupChatDefinedBefore) {
          return {
            code: "404",
            message: "group is not found",
            messages: [],
          };
        }

        const messages = await prisma.message.findMany({
          where: {
            groupChatUuid: groupChatUuid,
            text: {
              contains: searchMessage,
              mode: "insensitive",
            },
          },
        });

        const message = messages.map((msg) => msg);

        return {
          code: "200",
          message: "showing result",
          messages: message,
        };
      } catch (error) {
        return {
          code: "400",
          message: `${error}`,
          messages: [],
        };
      }
    },
  },
  Subscription: {
    // BURADA CLIENT KISMINDA ON CONNECTED YAP
    // BURADAKİ SUBS QUERY SİL
    messageSent: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("newMessage"),
        ({ newMessage }, args) => {
          console.log(newMessage);
          return (
            newMessage.senderUuid === args.userUuid ||
            newMessage.recipientUuid === args.userUuid
          );
        }
      ),
    },
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("newMessage"),
        ({ newMessage }, args) => {
          return (
            newMessage.senderUuid === args.userUuid ||
            newMessage.recipientUuid === args.userUuid
          );
        }
      ),
    },
    userStatus: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("USER_LOGIN"),
        (payload, variables) => {
          // Only push an update if the comment is on
          // the correct repository for this operation
          return true;
        }
      ),
    },
  },
};

export default resolvers;
