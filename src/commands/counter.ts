import { ChatInputCommandInteraction, Client, Events, Interaction } from "discord.js";
import { CounterChannel, PrismaClient } from "@prisma/client";

import { ICommandGroup } from "../types/commands";

const formatCounterChannels = (counterChannels: CounterChannel[]) =>
	counterChannels.map((channel) => `- <#${channel.id}>`);

class CounterCommandGroup implements ICommandGroup {
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
			const counterChannels = await this.dbClient.counterChannel.findMany();
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
	}

	async remove(interaction: ChatInputCommandInteraction) {
		const channelId = interaction.options.getString("channel-id")!;

		try {
			await this.dbClient.counterChannel.delete({ where: { id: channelId } });
			await interaction.reply({ content: `Counter successfully removed on channel <#${channelId}>` });
		} catch (error) {
			console.error(`[Counter] Remove channel - ${error}`);
			await interaction.reply("An unknown error occurred, try again or contact the administrator.");
		}
	}

	async add(interaction: ChatInputCommandInteraction) {
		const channelId = interaction.options.getString("channel-id")!;

		try {
			await this.dbClient.counterChannel.create({ data: { id: channelId } });
			await interaction.reply({ content: `Counter successfully added on channel <#${channelId}>` });
		} catch (error) {
			console.error(`[Counter] Add channel - ${error}`);
			await interaction.reply("An unknown error occurred, try again or contact the administrator.");
		}
	}
}

export default CounterCommandGroup;
