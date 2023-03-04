# Tele-bot-twitch-live-notifications
![](https://pngimg.com/uploads/twitch/twitch_PNG12.png)
## Description

This repo contains the framework for a telegram bot, which can be set to send you notifications when a streamer you follow is live. The bot checks if there has been any changes every 30 seconds. An example (probably offline) version of this bot can be found on telegram with the username @Twi_tele_bot

The bot works off different commands:

  - `/start` The bot gives a nice welcome.
  - `/help` Explains the different commands that can be used.
  - `/follows` outputs a list of streamers you currently are following, and if they are live or not.
  - `/check` gives a list of followed streamers that are currently live, with a link to the stream.
  - `Add <user_name>` Adds a streamer to the list of followed streams.
  - `rm <user_name>` Removes a streamer from the list, if they are within it.
  

## Prerequisites

In order to use this application framework, you'll need to have installed node.js (installing it through [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) is what I'd recommend).

## Dependecies

### Request library
This template also uses the 'request' library to send GET requests on Node.js. 

It can be installed through [npm](https://www.npmjs.com/package/request) with:


    npm i request

### Bot api

The application works off the 'node-telegram-bot-api' from https://www.npmjs.com/package/node-telegram-bot-api. 

A tutorial of how to setup and use this api can be found [here](https://github.com/hosein2398/node-telegram-bot-api-tutorial).

### Twitch

This bot also requires the use of twitch api and it's app access token. 

More information about the twitch api and it's references can be found at [link](https://dev.twitch.tv/docs/api/reference/). 

The guide to gaining an app access token is located at [link](https://dev.twitch.tv/docs/authentication/)
