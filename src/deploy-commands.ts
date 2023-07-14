import { REST } from "@discordjs/rest";
import { Routes, SlashCommandBuilder } from "discord.js";

import { APP_ID, BOT_TOKEN, GUILD_ID } from "./config";

const commands = [new SlashCommandBuilder().setName("list-youtube").setDescription("List YouTube subscriptions")];

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
