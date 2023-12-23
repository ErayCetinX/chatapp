-- CreateTable
CREATE TABLE "User" (
    "uuid" VARCHAR(64) NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "email" VARCHAR(70) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "deviceToken" VARCHAR(255) NOT NULL,
    "avatarUrl" VARCHAR(255) NOT NULL,
    "isVerifed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Picture" (
    "uuid" VARCHAR(64) NOT NULL,
    "pictureUrl" VARCHAR(120) NOT NULL,
    "userUuid" VARCHAR(64) NOT NULL,
    "postUuid" VARCHAR(64),
    "commentUuid" VARCHAR(64),
    "width" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Message" (
    "uuid" VARCHAR(64) NOT NULL,
    "text" VARCHAR(1000) NOT NULL,
    "pictureUuid" VARCHAR(64) NOT NULL,
    "senderUuid" VARCHAR(64) NOT NULL,
    "recipientUuid" VARCHAR(64) NOT NULL,
    "pictureUrl" VARCHAR(255) NOT NULL,
    "replyMessage" VARCHAR(1000),
    "replyMessagePictureUrl" VARCHAR(255),
    "replyMessageUserUuid" VARCHAR(64),
    "isReply" BOOLEAN NOT NULL DEFAULT false,
    "isPicture" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "GroupChat" (
    "uuid" VARCHAR(64) NOT NULL,
    "groupName" TEXT NOT NULL,
    "description" VARCHAR(8000) NOT NULL DEFAULT '',
    "ownerUserUuid" VARCHAR(64) NOT NULL,
    "groupAvatarUuid" VARCHAR(64) NOT NULL,

    CONSTRAINT "GroupChat_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "uuid" VARCHAR(64) NOT NULL,
    "groupUuid" VARCHAR(64) NOT NULL,
    "userUuid" VARCHAR(64) NOT NULL,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "FeedBack" (
    "uuid" VARCHAR(64) NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "senderUserUuid" VARCHAR(64) NOT NULL,
    "senderUserEmail" VARCHAR(70) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedBack_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Picture_uuid_key" ON "Picture"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Message_uuid_key" ON "Message"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "GroupChat_uuid_key" ON "GroupChat"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "FeedBack_uuid_key" ON "FeedBack"("uuid");

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderUuid_fkey" FOREIGN KEY ("senderUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientUuid_fkey" FOREIGN KEY ("recipientUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_pictureUuid_fkey" FOREIGN KEY ("pictureUuid") REFERENCES "Picture"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChat" ADD CONSTRAINT "GroupChat_ownerUserUuid_fkey" FOREIGN KEY ("ownerUserUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupUuid_fkey" FOREIGN KEY ("groupUuid") REFERENCES "GroupChat"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedBack" ADD CONSTRAINT "FeedBack_senderUserEmail_fkey" FOREIGN KEY ("senderUserEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedBack" ADD CONSTRAINT "FeedBack_senderUserUuid_fkey" FOREIGN KEY ("senderUserUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
