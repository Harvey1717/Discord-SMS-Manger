const Discord = require('discord.js');
const mongoose = require('mongoose');
const log = require('@harvey1717/logger')();

const { dbURL } = require('../config/dbConfig');
const { token } = require('../config/discordConfig');
const handleBotEvents = require('./handleBotEvents');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

// * Completed commands:
// * - ping
// * - register
// * - help
// * - info
// * Admin and Staff only compatibility
// TODO
// * - send
// TODO

// mongoose
//   .connect(dbURL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   })
//   .then(() => {
//     log.log('Connected to DB');
    bot.login(token);
    handleBotEvents(bot);
  // })
  // .catch((err) => console.log(err));
