-- CreateTable
CREATE TABLE "ChannelCounter" (
    "id" TEXT NOT NULL,

    CONSTRAINT "ChannelCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChannelCounter_id_key" ON "ChannelCounter"("id");
