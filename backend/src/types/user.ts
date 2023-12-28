import { User } from "@prisma/client";

export type IUser = User & {
  isOnline?: boolean;
  lastMessage?: string;
  InboxUuid?: string

};
