import { Events } from "discord.js";
import Parser from "rss-parser";
import { z } from "zod";

import client from "../client";
import prisma from "../db/client";
import { isTextChannel } from "../types/discord";

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

	const dbVideo = await prisma.youtubeVideo.findUnique({ where: { id: lastVideo.id } });
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

	const channels = await prisma.youtubeChannelSubscription.findMany();

	await Promise.all(
		channels.map(async (channel) => {
			const info = await checkVideos(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`);
			if (!info) return;

			try {
				const video = videoSchema.parse(info);
				await prisma.youtubeVideo.create({ data: video });

				const outputChannel = client.channels.cache.get(channel.outputChannelId);
				if (!outputChannel || !isTextChannel(outputChannel)) {
					console.error(`[YouTube][${channel.id}] Channel not found`);
					return;
				}
				outputChannel.send({ content: `${video.author} just uploaded a video, go check it out! ${video.link}` });
			} catch {
				console.error(`[YouTube][${channel.id}] Video has the wrong format.`);
			}
		}),
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
