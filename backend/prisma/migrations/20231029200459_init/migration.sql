/*
  Warnings:

  - You are about to drop the column `isOwner` on the `GroupMember` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupChat" DROP CONSTRAINT "GroupChat_ownerUserUuid_fkey";

-- AlterTable
ALTER TABLE "GroupMember" DROP COLUMN "isOwner";
