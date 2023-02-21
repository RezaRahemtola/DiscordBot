import { Events, Message, PartialMessage } from "discord.js";

import { COUNTER_CHANNEL_IDS } from "./config";
import checkYoutubeVideos from "./youtube";
import client from "./client";
import isTextChannel from "./utils";

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	checkYoutubeVideos();
	setInterval(checkYoutubeVideos, 300 * 1000);
});

async function updateMessageCounterChannel(message: Message | PartialMessage) {
	if (COUNTER_CHANNEL_IDS.includes(message.channelId) && isTextChannel(message.channel)) {
		const { channel } = message;
		await channel.messages.fetch();
		const count = channel.messages.cache.map((x) => x).length;
		channel.setName(channel.name.replace(/\d+/, count.toString()));
	}
}

client.on(Events.MessageCreate, async (message) => {
	await updateMessageCounterChannel(message);
});

client.on(Events.MessageDelete, async (message) => {
	await updateMessageCounterChannel(message);
});
