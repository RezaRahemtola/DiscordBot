import { ChatInputCommandInteraction, Events, Interaction } from "discord.js";

import { CounterChannel } from "@prisma/client";
import client from "../client";
import prisma from "../db/client";

const formatCounterChannels = (counterChannels: CounterChannel[]) =>
	counterChannels.map((channel) => `- <#${channel.id}>`);

const listCounter = async (interaction: ChatInputCommandInteraction) => {
	try {
		const counterChannels = await prisma.counterChannel.findMany();
		const ids = counterChannels.map((channel) => channel.id);

		if (ids.length === 0) {
			await interaction.reply({ content: "No counter" });
			return;
		}
		const channels = formatCounterChannels(counterChannels);

		await interaction.reply({ content: channels.join("\n") });
	} catch (error) {
		console.error(`[Counter] Channel listing - ${error}`);
		await interaction.reply({ content: "An unknown error occurred, try again or contact the administrator." });
	}
};

const addCounter = async (interaction: ChatInputCommandInteraction) => {
	const channelId = interaction.options.getString("channel-id")!;

	try {
		await prisma.counterChannel.create({ data: { id: channelId } });
		await interaction.reply({ content: `Counter successfully added on channel <#${channelId}>` });
	} catch (error) {
		console.error(`[Counter] Add channel - ${error}`);
		await interaction.reply("An unknown error occurred, try again or contact the administrator.");
	}
};

const removeCounter = async (interaction: ChatInputCommandInteraction) => {
	const channelId = interaction.options.getString("channel-id")!;

	try {
		await prisma.counterChannel.delete({ where: { id: channelId } });
		await interaction.reply({ content: `Counter successfully removed on channel <#${channelId}>` });
	} catch (error) {
		console.error(`[Counter] Remove channel - ${error}`);
		await interaction.reply("An unknown error occurred, try again or contact the administrator.");
	}
};

const setupCounter = () => {
	client.on(Events.InteractionCreate, async (interaction: Interaction) => {
		if (interaction.guild === null || !interaction.isChatInputCommand()) return;

		if (interaction.commandName === "counter-list") {
			await listCounter(interaction);
		} else if (interaction.commandName === "counter-add") {
			await addCounter(interaction);
		} else if (interaction.commandName === "counter-remove") {
			await removeCounter(interaction);
		}
	});
};

export default setupCounter;
