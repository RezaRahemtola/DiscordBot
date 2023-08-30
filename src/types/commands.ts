import { ChatInputCommandInteraction } from "discord.js";

type TInteractionListener = (interaction: ChatInputCommandInteraction) => Promise<void>;

export interface ICommandGroup {
	add: TInteractionListener;
	remove: TInteractionListener;
	list: TInteractionListener;
	setup: () => void;
}
