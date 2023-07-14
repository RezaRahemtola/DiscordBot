import { Client, GatewayIntentBits } from "discord.js";

import { BOT_TOKEN } from "./config";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.login(BOT_TOKEN).then();
export default client;
