import { Events } from "discord.js";

import client from "./client";
import setupCommands from "./commands";
import setupTasks from "./tasks";

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (c) => {
	console.log(`[INIT] Ready! Logged in as ${c.user.tag}`);
});

setupCommands();
setupTasks();
