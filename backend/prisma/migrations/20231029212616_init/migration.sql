/*
  Warnings:

  - Added the required column `ownerUserUuid` to the `GroupChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupChat" ADD COLUMN     "ownerUserUuid" VARCHAR(64) NOT NULL;
