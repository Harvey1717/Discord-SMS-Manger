const Discord = require('discord.js');
const log = require('@harvey1717/logger')();

const handleBotEvents = require('./src/handleBotEvents');
const { dbURL } = require('./config/dbConfig.json');

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

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    log.log('Connected to MongoDB');
    bot.login(token);
    handleBotEvents(bot);
  })
  .catch((err) => console.log(err));
