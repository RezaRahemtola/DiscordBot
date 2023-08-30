import YoutubeSubscriptionCommandGroup from "./youtube";
import CounterCommandGroup from "./counter";
import prismaClient from "../db/client";
import client from "../client";

const setupCommands = () => {
	new CounterCommandGroup(client, prismaClient).setup();
	new YoutubeSubscriptionCommandGroup(client, prismaClient).setup();
};

export default setupCommands;
