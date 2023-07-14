import { Events, Message, PartialMessage } from "discord.js";

import client from "../client";
import { COUNTER_CHANNEL_IDS } from "../config";
import isTextChannel from "../utils";

const updateMessageCounterChannel = async (message: Message | PartialMessage) => {
	if (COUNTER_CHANNEL_IDS.includes(message.channelId) && isTextChannel(message.channel)) {
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
