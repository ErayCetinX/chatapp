-- CreateTable
CREATE TABLE "Notifications" (
    "uuid" VARCHAR(64) NOT NULL,
    "content" VARCHAR(1200) NOT NULL,
    "senderUuid" VARCHAR(64) NOT NULL,
    "recevierUuid" VARCHAR(64) NOT NULL,
    "groupUuid" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notifications_uuid_key" ON "Notifications"("uuid");

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_senderUuid_fkey" FOREIGN KEY ("senderUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_recevierUuid_fkey" FOREIGN KEY ("recevierUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
