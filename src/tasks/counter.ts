import { Events, Message, PartialMessage } from "discord.js";

import client from "../client";
import isTextChannel from "../utils";
import prisma from "../db/client";

const updateMessageCounterChannel = async (message: Message | PartialMessage) => {
	const counterChannels = await prisma.counterChannel.findMany();
	const channelIds = counterChannels.map((channel) => channel.id);

	if (channelIds.includes(message.channelId) && isTextChannel(message.channel)) {
		const { channel } = message;
		await channel.messages.fetch();
		const count = channel.messages.cache.map((x) => x).length;
		channel.setName(channel.name.replace(/\d+/, count.toString()));
	}
};

const setupCounter = () => {
	client.on(Events.MessageCreate, async (message) => {
		await updateMessageCounterChannel(message);
	});

	client.on(Events.MessageDelete, async (message) => {
		await updateMessageCounterChannel(message);
	});
};

export default setupCounter;
