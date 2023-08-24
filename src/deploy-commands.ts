import { REST } from "@discordjs/rest";
import { Routes, SlashCommandBuilder } from "discord.js";

import { APP_ID, BOT_TOKEN, GUILD_ID } from "./config";

const commands = [
	new SlashCommandBuilder().setName("youtube-list").setDescription("List YouTube subscriptions"),
	new SlashCommandBuilder()
		.setName("youtube-add-subscription")
		.setDescription("Add a YouTube channel subscription")
		.addStringOption((option) => option.setName("channel-id").setDescription("YouTube channel ID").setRequired(true))
		.addStringOption((option) =>
			option
				.setName("output-discord-id")
				.setDescription("Channel ID where the notifications will be sent")
				.setRequired(true),
		),
	new SlashCommandBuilder()
		.setName("youtube-remove-subscription")
		.setDescription("Remove a YouTube channel subscription")
		.addStringOption((option) => option.setName("channel-id").setDescription("YouTube channel ID").setRequired(true)),
];

const rest = new REST().setToken(BOT_TOKEN);
(async () => {
	try {
		console.log("[INIT] Started refreshing application (/) commands.");

		await rest.put(Routes.applicationGuildCommands(APP_ID, GUILD_ID), {
			body: commands.map((c) => c.toJSON()),
		});

		console.log("[INIT] Successfully reloaded application (/) commands and permissions.");
	} catch (error) {
		console.error(error);
	}
})();
