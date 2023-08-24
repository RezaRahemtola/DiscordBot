import { config } from "dotenv";
import { get } from "env-var";

config();
const env = (name: string, required = true) => get(name).required(required);

const BOT_TOKEN = env("BOT_TOKEN").asString();
const APP_ID = env("APP_ID").asString();
const GUILD_ID = env("GUILD_ID").asString();

const COUNTER_CHANNEL_IDS = env("COUNTER_CHANNEL_IDS").asArray();

const YTB_API_KEY = env("YTB_API_KEY").asString();

export { BOT_TOKEN, APP_ID, GUILD_ID, COUNTER_CHANNEL_IDS, YTB_API_KEY };
