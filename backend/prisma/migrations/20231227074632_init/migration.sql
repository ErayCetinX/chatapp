-- CreateTable
CREATE TABLE "MessageBox" (
    "uuid" VARCHAR(64) NOT NULL,
    "request" VARCHAR(64) NOT NULL,
    "accepting" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageBox_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageBox_uuid_key" ON "MessageBox"("uuid");
