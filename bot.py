import discord
import re

client = discord.Client()

@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))

@client.event
async def on_message(message):
    if str(message.author) == "YAGPDB.xyz#8760" and "uploaded a new youtube video!" in message.content:
        count = 0

        async for msg in message.channel.history():
            if str(msg.author) == "YAGPDB.xyz#8760":
                count += 1
    
        newName = re.sub("\d+", str(count), message.channel.name)

        await message.channel.edit(name=newName)


    elif str(message.author) == "Reza#4176" and "watch-later" in message.channel.name:
        count = 0

        async for msg in message.channel.history():
            if str(msg.author) == "Reza#4176":
                count += 1
    
        newName = re.sub("\d+", str(count), message.channel.name)
        print("Updating name to "+newName)
        await message.channel.edit(name=newName)



client.run("ODU1OTE1ODU3ODE2NTg0MjAz.YM5bwg.ds0Rnn5Z_eyjpmkqmV7kG-XlYdE")