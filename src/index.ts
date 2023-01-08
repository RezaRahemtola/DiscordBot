// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits, Message, PartialMessage, TextChannel } from "discord.js";

import { BOT_TOKEN, COUNTER_CHANNEL_IDS } from "./config";

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(BOT_TOKEN);

const isTextChannel = (channel: any): channel is TextChannel => channel?.name;

async function updateMessageCounterChannel(message: Message | PartialMessage) {
	if (COUNTER_CHANNEL_IDS.includes(message.channelId) && isTextChannel(message.channel)) {
		const { channel } = message;
		await channel.messages.fetch();
		const count = channel.messages.cache.map((x) => x).length;
		channel.setName(channel.name.replace(/\d+/, count.toString()));
	}
}

client.on(Events.MessageCreate, async (message) => {
	updateMessageCounterChannel(message);
});

client.on(Events.MessageDelete, async (message) => {
	updateMessageCounterChannel(message);
});
