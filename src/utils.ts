import { TextChannel } from "discord.js";

const isTextChannel = (channel: any): channel is TextChannel => channel?.name;

export default isTextChannel;
