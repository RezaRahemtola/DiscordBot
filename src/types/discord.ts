import { Channel, TextChannel } from "discord.js";

// eslint-disable-next-line import/prefer-default-export
export const isTextChannel = (channel: Channel): channel is TextChannel => (channel as TextChannel).name !== undefined;
