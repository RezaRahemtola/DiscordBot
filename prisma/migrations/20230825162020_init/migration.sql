-- CreateTable
CREATE TABLE "YoutubeVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "pubDate" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "YoutubeVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubeChannelSubscription" (
    "id" TEXT NOT NULL,
    "outputChannelId" TEXT NOT NULL,

    CONSTRAINT "YoutubeChannelSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeVideo_id_key" ON "YoutubeVideo"("id");

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeChannelSubscription_id_key" ON "YoutubeChannelSubscription"("id");
