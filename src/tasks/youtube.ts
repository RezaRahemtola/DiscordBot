import { Events } from "discord.js";
import Parser from "rss-parser";
import { z } from "zod";

import client from "../client";
import { YTB_CHANNEL_IDS, YTB_DISCORD_CHANNEL_ID } from "../config";
import prisma from "../db/client";
import isTextChannel from "../utils";

const parser = new Parser();

const getLastVideo = async (rssURL: string) => {
	const content = await parser.parseURL(rssURL);

	const lastVideos = content.items.sort((a, b) => {
		const aPubDate = new Date(a.pubDate || 0).getTime();
		const bPubDate = new Date(b.pubDate || 0).getTime();
		return bPubDate - aPubDate;
	});
	return lastVideos[0];
};

const checkVideos = async (rssURL: string) => {
	const lastVideo = await getLastVideo(rssURL);
	// If there isn't any video, return
	if (!lastVideo) return undefined;

	const dbVideo = await prisma.videos.findUnique({ where: { id: lastVideo.id } });
	if (dbVideo) return undefined;

	return lastVideo;
};

const checkYoutubeVideos = async () => {
	const videoSchema = z.object({
		id: z.string(),
		title: z.string(),
		author: z.string(),
		pubDate: z.string(),
		link: z.string(),
	});

	await Promise.all(
		YTB_CHANNEL_IDS.map(async (channelId) => {
			const info = await checkVideos(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
			if (!info) return;

			try {
				const video = videoSchema.parse(info);
				await prisma.videos.create({ data: video });

				const channel = client.channels.cache.get(YTB_DISCORD_CHANNEL_ID);
				if (!channel || !isTextChannel(channel)) {
					console.error(`[YouTube][${channelId}] Channel not found`);
					return;
				}
				channel.send({ content: `${video.author} just uploaded a video, go check it out! ${video.link}` });
			} catch {
				console.error(`[YouTube][${channelId}] Video has the wrong format.`);
			}
		})
	);
};

const setupYoutube = () => {
	const MINUTES_INTERVAL = 5;
	const MILLISEC_INTERVAL = MINUTES_INTERVAL * 60 * 1000;

	client.once(Events.ClientReady, async () => {
		checkYoutubeVideos();
		setInterval(checkYoutubeVideos, MILLISEC_INTERVAL);
	});
};

export default setupYoutube;
