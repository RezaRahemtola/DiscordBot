# Discord bot

A simple bot for my personal discord server

## Features

- [Update a channel name](src/tasks/counter.ts) according to the number of messages inside it
    - [Add, remove and list counters](src/commands/counter.ts) with slash commands
- YouTube
    - [Receive notifications](src/tasks/youtube.ts) in a specified channel
      > Created to allow unlimited subscriptions (bots like [Carl](https://carl.gg/) have a limited free tier for this)
    - [Add, remove and list subscriptions](src/commands/youtube.ts) with slash commands

## Credits

The YouTube notification feature is highly inspired from [Androz2091/DiscordYoutubeNotifier](https://github.com/Androz2091/DiscordYoutubeNotifier).
