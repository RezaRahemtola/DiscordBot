import discord
import re
import os
from sys import argv

# Importing environment variables for local usage
from dotenv import load_dotenv
load_dotenv("./variables.env")

client = discord.Client()

@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))
    if len(argv) > 1 and argv[1] == "update":
        print("Running single update...")
        await singleUpdate()
        print("Done, logging out from {0.user}".format(client))
        await client.close()

@client.event
async def on_message(message):
    await updateChannelName(message, "uploaded a new youtube video!")
    await updateChannelName(message, "-watch-later-")

    if "-update" in message.content and "admin" in message.channel.name:
        channelsID = os.environ["CHANNELS_ID"].split(", ")
        for id in channelsID:
            channel = discord.utils.get(client.get_all_channels(), id=int(id))
            await updateChannelName(message, "-", channel)
        await message.channel.send("Channels successfully updated !")


async def updateChannelName(message, content, channel=None):
    if channel is None:
        channel = message.channel

    if content in message.content or content in channel.name:
        count = 0
        async for msg in channel.history():
            count += 1
        newName = re.sub("\d+", str(count), channel.name)
        if newName != channel.name:
            print(f"Updating name to {newName} (previously {channel.name})")
            await channel.edit(name=newName)
            print("Name updated to "+newName)

async def singleUpdate():
    channelsID = os.environ["CHANNELS_ID"].split(", ")
    for id in channelsID:
        channel = discord.utils.get(client.get_all_channels(), id=int(id))

        count = 0
        async for msg in channel.history():
            count += 1
        newName = re.sub("\d+", str(count), channel.name)
        if newName != channel.name:
            print(f"Updating name to {newName} (previously {channel.name})")
            await channel.edit(name=newName)
            print("Name updated to "+newName)

    print("Channels successfully updated !")

client.run(os.environ['BOT_TOKEN'])