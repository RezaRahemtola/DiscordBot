/*
  Warnings:

  - You are about to drop the `ChannelCounter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ChannelCounter";

-- CreateTable
CREATE TABLE "CounterChannel" (
    "id" TEXT NOT NULL,

    CONSTRAINT "CounterChannel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CounterChannel_id_key" ON "CounterChannel"("id");
