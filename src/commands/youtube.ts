import axios from "axios";
import { ChatInputCommandInteraction, Events, Interaction } from "discord.js";
import { z } from "zod";

import client from "../client";
import { YTB_API_KEY } from "../config";
import prisma from "../db/client";

const ZSchemaResponseItems = z.array(z.object({ id: z.string(), snippet: z.object({ title: z.string() }) }));
type TResponseItems = z.infer<typeof ZSchemaResponseItems>;

const formatChannels = (items: TResponseItems) => items.map((item) => `- ${item.snippet.title} (ID: "${item.id}")`);

const listYoutube = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({ content: "Loading..." });

	const schema = z.object({
		items: ZSchemaResponseItems,
	});

	try {
		const youtubeChannels = await prisma.youtubeChannelSubscription.findMany();
		const ids = youtubeChannels.map((channel) => channel.id);

		if (ids.length === 0) {
			await interaction.editReply({ content: "No subscription" });
			return;
		}
		const response = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
			params: { key: YTB_API_KEY, part: "snippet", id: ids.join(",") },
		});
		const data = schema.parse(response.data);
		const channels = formatChannels(data.items);

		await interaction.editReply({ content: channels.join("\n") });
	} catch (error) {
		console.error(`[YouTube] Channel listing - ${error}`);
		await interaction.editReply({ content: "An unknown error occurred, try again or contact the administrator." });
	}
};

const addSubscription = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({ content: "Loading..." });

	const channelId = interaction.options.getString("channel-id")!;
	const outputDiscordId = interaction.options.getString("output-discord-id")!;

	try {
		await prisma.youtubeChannelSubscription.create({ data: { id: channelId, outputChannelId: outputDiscordId } });
		await interaction.reply({ content: "Channel successfully added." });
	} catch (error) {
		console.error(`[YouTube] Add subscription - ${error}`);
		await interaction.editReply("An unknown error occurred, try again or contact the administrator.");
	}
};

const setupYoutube = () => {
	client.on(Events.InteractionCreate, async (interaction: Interaction) => {
		if (interaction.guild === null || !interaction.isChatInputCommand()) return;

		if (interaction.commandName === "youtube-list") {
			await listYoutube(interaction);
		} else if (interaction.commandName === "youtube-add-subscription") {
			await addSubscription(interaction);
		}
	});
};

export default setupYoutube;
