import { config } from "dotenv";
import { get } from "env-var";

config();
const env = (name: string, required = true) => get(name).required(required);

const BOT_TOKEN = env("BOT_TOKEN").asString();

export default BOT_TOKEN;
