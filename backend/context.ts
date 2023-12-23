import { PrismaClient } from "@prisma/client"

export interface Context {
  prisma: PrismaClient
  getLoggedInUserDetails: {
    uuid: string;
    username: string;
    email: string;
    isOnline?:boolean;
  }
}