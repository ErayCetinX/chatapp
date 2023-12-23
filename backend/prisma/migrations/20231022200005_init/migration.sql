/*
  Warnings:

  - You are about to drop the column `groupAvatarUuid` on the `GroupChat` table. All the data in the column will be lost.
  - You are about to drop the column `pictureUuid` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Picture` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupAvatarUrl` to the `GroupChat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_pictureUuid_fkey";

-- DropForeignKey
ALTER TABLE "Picture" DROP CONSTRAINT "Picture_userUuid_fkey";

-- AlterTable
ALTER TABLE "GroupChat" DROP COLUMN "groupAvatarUuid",
ADD COLUMN     "groupAvatarUrl" VARCHAR(64) NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "pictureUuid";

-- DropTable
DROP TABLE "Picture";
