import axios from "axios";
import { ChatInputCommandInteraction, Events, Interaction } from "discord.js";
import { z } from "zod";

import client from "../client";
import { YTB_API_KEY, YTB_CHANNEL_IDS } from "../config";

const ZSchemaResponseItems = z.array(z.object({ id: z.string(), snippet: z.object({ title: z.string() }) }));
type TResponseItems = z.infer<typeof ZSchemaResponseItems>;

const formatChannels = (items: TResponseItems) => items.map((item) => `- ${item.snippet.title} (ID: "${item.id}")`);

const listYoutube = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({ content: "Loading..." });

	const schema = z.object({
		items: ZSchemaResponseItems
	});

	try {
		const response = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
			params: { key: YTB_API_KEY, part: "snippet", id: YTB_CHANNEL_IDS.join(",") }
		});
		const data = schema.parse(response.data);
		const channels = formatChannels(data.items);

		await interaction.editReply({ content: channels.join("\n") });
	} catch (error) {
		console.error(`[YouTube] Channel listing - ${error}`);
	}
};

const setupYoutube = () => {
	client.on(Events.InteractionCreate, async (interaction: Interaction) => {
		if (interaction.guild === null || !interaction.isChatInputCommand()) return;

		if (interaction.commandName === "list-youtube") {
			await listYoutube(interaction);
		}
	});
};

export default setupYoutube;
