import Parser from "rss-parser";
import { z } from "zod";
import { Events } from "discord.js";
import prisma from "../db/client";
import { YTB_CHANNEL_IDS, YTB_DISCORD_CHANNEL_ID } from "../config";
import client from "../client";
import isTextChannel from "../utils";

const parser = new Parser();

async function getLastVideo(rssURL: string) {
	const content = await parser.parseURL(rssURL);

	const lastVideos = content.items.sort((a, b) => {
		const aPubDate = new Date(a.pubDate || 0).getTime();
		const bPubDate = new Date(b.pubDate || 0).getTime();
		return bPubDate - aPubDate;
	});
	return lastVideos[0];
}

async function checkVideos(rssURL: string) {
	const lastVideo = await getLastVideo(rssURL);
	// If there isn't any video, return
	if (!lastVideo) return undefined;

	const dbVideo = await prisma.videos.findUnique({ where: { id: lastVideo.id } });
	if (dbVideo) return undefined;

	return lastVideo;
}

async function checkYoutubeVideos() {
	const schema = z.object({
		id: z.string(),
		title: z.string(),
		author: z.string(),
		pubDate: z.string(),
		link: z.string(),
	});

	YTB_CHANNEL_IDS.forEach(async (channelId): Promise<void> => {
		const info = await checkVideos(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
		if (!info) return;

		try {
			const video = schema.parse(info);
			await prisma.videos.create({ data: video });

			const channel = client.channels.cache.get(YTB_DISCORD_CHANNEL_ID);
			if (!channel || !isTextChannel(channel)) {
				console.log(`[YouTube][${channelId}] Channel not found`);
				return;
			}
			channel.send({ content: `${video.author} just uploaded a video, go check it out! ${video.link}` });
		} catch {
			console.log(`[YouTube][${channelId}] Video has the wrong format.`);
		}
	});
}

const setupYoutube = () => {
	client.once(Events.ClientReady, async () => {
		checkYoutubeVideos();
		setInterval(checkYoutubeVideos, 300 * 1000);
	});
};

export default setupYoutube;
