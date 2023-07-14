import { Channel, TextChannel } from "discord.js";

const isTextChannel = (channel: Channel): channel is TextChannel => (channel as TextChannel).name !== undefined;

export default isTextChannel;
