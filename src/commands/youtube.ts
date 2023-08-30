import axios from "axios";
import { ChatInputCommandInteraction, Client, Events, Interaction } from "discord.js";

import { PrismaClient } from "@prisma/client";
import { YTB_API_KEY } from "../config";
import { ICommandGroup } from "../types/commands";
import { TYoutubeChannelsResponse } from "../types/youtube";
import { formatYoutubeChannelsResponse } from "../formatters/youtube";

class YoutubeSubscriptionCommandGroup implements ICommandGroup {
	constructor(
		private client: Client,
		private dbClient: PrismaClient,
		private commandPrefix: string = "counter",
	) {}

	setup() {
		this.client.on(Events.InteractionCreate, async (interaction: Interaction) => {
			if (interaction.guild === null || !interaction.isChatInputCommand()) return;

			if (interaction.commandName === `${this.commandPrefix}-list`) {
				await this.list(interaction);
			} else if (interaction.commandName === `${this.commandPrefix}-add`) {
				await this.add(interaction);
			} else if (interaction.commandName === `${this.commandPrefix}-remove`) {
				await this.remove(interaction);
			}
		});
	}

	async list(interaction: ChatInputCommandInteraction) {
		try {
			const youtubeChannels = await this.dbClient.youtubeChannelSubscription.findMany();
			const ids = youtubeChannels.map((channel) => channel.id);

			if (ids.length === 0) {
				await interaction.reply({ content: "No subscription" });
				return;
			}
			const response = await axios.get<TYoutubeChannelsResponse>("https://www.googleapis.com/youtube/v3/channels", {
				params: { key: YTB_API_KEY, part: "snippet", id: ids.join(",") },
			});
			const channels = formatYoutubeChannelsResponse(response.data.items, youtubeChannels);

			await interaction.reply({ content: channels.join("\n") });
		} catch (error) {
			console.error(`[YouTube] Channel listing - ${error}`);
			await interaction.reply({ content: "An unknown error occurred, try again or contact the administrator." });
		}
	}

	async remove(interaction: ChatInputCommandInteraction) {
		const channelId = interaction.options.getString("channel-id")!;

		try {
			await this.dbClient.youtubeChannelSubscription.delete({ where: { id: channelId } });
			await interaction.reply({ content: "Channel successfully removed." });
		} catch (error) {
			console.error(`[YouTube] Remove subscription - ${error}`);
			await interaction.reply("An unknown error occurred, try again or contact the administrator.");
		}
	}

	async add(interaction: ChatInputCommandInteraction) {
		const channelId = interaction.options.getString("channel-id")!;
		const outputDiscordId = interaction.options.getString("output-discord-id")!;

		try {
			await this.dbClient.youtubeChannelSubscription.create({
				data: {
					id: channelId,
					outputChannelId: outputDiscordId,
				},
			});
			await interaction.reply({ content: "Channel successfully added." });
		} catch (error) {
			console.error(`[YouTube] Add subscription - ${error}`);
			await interaction.reply("An unknown error occurred, try again or contact the administrator.");
		}
	}
}

export default YoutubeSubscriptionCommandGroup;
