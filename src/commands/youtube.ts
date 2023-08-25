import axios from "axios";
import { ChatInputCommandInteraction, Events, Interaction } from "discord.js";
import { z } from "zod";

import { YoutubeChannelSubscription } from "@prisma/client";
import client from "../client";
import { YTB_API_KEY } from "../config";
import prisma from "../db/client";

const ZSchemaResponseItems = z.array(z.object({ id: z.string(), snippet: z.object({ title: z.string() }) }));
type TResponseItems = z.infer<typeof ZSchemaResponseItems>;

const formatChannels = (items: TResponseItems, youtubeChannels: YoutubeChannelSubscription[]) =>
	items.map((item) => {
		const outputDiscordId = youtubeChannels.find((c) => c.id === item.id)?.outputChannelId;
		return `- ${item.snippet.title} (Channel ID: \`${item.id}\`, sent in <#${outputDiscordId}>)`;
	});

const listYoutube = async (interaction: ChatInputCommandInteraction) => {
	const schema = z.object({
		items: ZSchemaResponseItems,
	});

	try {
		const youtubeChannels = await prisma.youtubeChannelSubscription.findMany();
		const ids = youtubeChannels.map((channel) => channel.id);

		if (ids.length === 0) {
			await interaction.reply({ content: "No subscription" });
			return;
		}
		const response = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
			params: { key: YTB_API_KEY, part: "snippet", id: ids.join(",") },
		});
		const data = schema.parse(response.data);
		const channels = formatChannels(data.items, youtubeChannels);

		await interaction.reply({ content: channels.join("\n") });
	} catch (error) {
		console.error(`[YouTube] Channel listing - ${error}`);
		await interaction.reply({ content: "An unknown error occurred, try again or contact the administrator." });
	}
};

const addSubscription = async (interaction: ChatInputCommandInteraction) => {
	const channelId = interaction.options.getString("channel-id")!;
	const outputDiscordId = interaction.options.getString("output-discord-id")!;

	try {
		await prisma.youtubeChannelSubscription.create({ data: { id: channelId, outputChannelId: outputDiscordId } });
		await interaction.reply({ content: "Channel successfully added." });
	} catch (error) {
		console.error(`[YouTube] Add subscription - ${error}`);
		await interaction.reply("An unknown error occurred, try again or contact the administrator.");
	}
};

const removeSubscription = async (interaction: ChatInputCommandInteraction) => {
	const channelId = interaction.options.getString("channel-id")!;

	try {
		await prisma.youtubeChannelSubscription.delete({ where: { id: channelId } });
		await interaction.reply({ content: "Channel successfully removed." });
	} catch (error) {
		console.error(`[YouTube] Remove subscription - ${error}`);
		await interaction.reply("An unknown error occurred, try again or contact the administrator.");
	}
};

const setupYoutube = () => {
	client.on(Events.InteractionCreate, async (interaction: Interaction) => {
		if (interaction.guild === null || !interaction.isChatInputCommand()) return;

		if (interaction.commandName === "youtube-list") {
			await listYoutube(interaction);
		} else if (interaction.commandName === "youtube-add-subscription") {
			await addSubscription(interaction);
		} else if (interaction.commandName === "youtube-remove-subscription") {
			await removeSubscription(interaction);
		}
	});
};

export default setupYoutube;
