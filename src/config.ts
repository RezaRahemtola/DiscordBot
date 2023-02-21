import { config } from "dotenv";
import { get } from "env-var";

config();
const env = (name: string, required = true) => get(name).required(required);

const BOT_TOKEN = env("BOT_TOKEN").asString();

const COUNTER_CHANNEL_IDS = env("COUNTER_CHANNEL_IDS").asArray();

const YTB_DISCORD_CHANNEL_ID = env("YTB_DISCORD_CHANNEL_ID").asString();
const YTB_CHANNEL_IDS = env("YTB_CHANNEL_IDS").asArray();

export { BOT_TOKEN, COUNTER_CHANNEL_IDS, YTB_DISCORD_CHANNEL_ID, YTB_CHANNEL_IDS };
