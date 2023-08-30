import { YoutubeChannelSubscription } from "@prisma/client";
import { TYoutubeChannelsResponseItems } from "../types/youtube";

// eslint-disable-next-line import/prefer-default-export
export const formatYoutubeChannelsResponse = (
	items: TYoutubeChannelsResponseItems,
	youtubeChannels: YoutubeChannelSubscription[],
) =>
	items.map((item) => {
		const outputDiscordId = youtubeChannels.find((c) => c.id === item.id)?.outputChannelId;
		return `- ${item.snippet.title} (Channel ID: \`${item.id}\`, sent in <#${outputDiscordId}>)`;
	});
