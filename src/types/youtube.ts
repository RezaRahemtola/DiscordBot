import { z } from "zod";

const ZYoutubeChannelsResponseItems = z.array(z.object({ id: z.string(), snippet: z.object({ title: z.string() }) }));
export type TYoutubeChannelsResponseItems = z.infer<typeof ZYoutubeChannelsResponseItems>;

const ZYoutubeChannelsResponse = z.object({
	items: ZYoutubeChannelsResponseItems,
});
export type TYoutubeChannelsResponse = z.infer<typeof ZYoutubeChannelsResponse>;
