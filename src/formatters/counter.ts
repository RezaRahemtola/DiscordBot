import { CounterChannel } from "@prisma/client";

// eslint-disable-next-line import/prefer-default-export
export const formatCounterChannels = (counterChannels: CounterChannel[]) =>
	counterChannels.map((channel) => `- <#${channel.id}>`);
