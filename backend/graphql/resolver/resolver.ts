import { Context } from "../../context";
import pubsub from "../../src/helpers/pubsub";
import token from "../../src/helpers/token";

import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { withFilter } from "graphql-subscriptions";

import { IUser } from "../../src/types/user";

const resolvers = {
  Mutation: {
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
        sigInUser: { email, password, DeviceToken },
      }: {
        sigInUser: { email: string; password: string; DeviceToken: string };
      },
      { prisma }: Context
    ) => {
      // Fristname is null
      if (email.trim() === "") {
        throw new Error("Your email cannot be blank");
      }

      // Password is null
      if (password.trim() === "") {
        throw new Error("Your password cannot be empty");
      }

      // User check
      const user: IUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      // İf there is no username
      if (!user) {
        throw new Error("There is no user with the email you entered!");
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
    createMessage: async (
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
    ) => {
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

        if (pictureUrl) {
          const message = await prisma.message.create({
            data: {
              uuid: v4(),
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
                uuid: v4(),
                content: `${getLoggedInUserDetails.username} sent you a message.`,
                senderUuid: getLoggedInUserDetails.uuid, // Gönderen
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

            pubsub.publish("New Notifications", {
              Notifications: UserNoti,
            });
          }

          pubsub.publish("newMessage", {
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
            uuid: v4(),
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
              uuid: v4(),
              content: `${getLoggedInUserDetails.username} sent you a message.`,
              senderUuid: getLoggedInUserDetails.uuid, // Gönderen
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

          pubsub.publish("New Notifications", {
            Notifications: UserNoti,
          });
        }

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
