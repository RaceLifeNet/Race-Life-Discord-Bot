/**********************************************************************/
// Declare Constant Variables

const fs = require('fs');
const chalk = require('chalk');
const {
  Client, Collection, Intents, MessageEmbed,
} = require('discord.js');
const { readFileSync, writeFileSync } = require('node:fs');

const intents = new Intents();
intents.add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_MEMBERS,
);

const client = new Client({ intents, partials: ['MESSAGE', 'REACTION'], allowedMentions: { parse: ['users'] } });
require('dotenv').config();

client.SlashCommands = new Collection();
const commandFiles = fs.readdirSync('./slashcmds').filter((file) => file.endsWith('.js'));


process.on('unhandledRejection', (error) => {
  console.log(error);
});

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require("node:fs");
const { join, resolve } = require("node:path");
const users = client.users.cache.filter(user => !user.bot);

/**********************************************************************/
// Event Handler

function loadCommands(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) loadCommands(path);
    else if (
      entry.isFile() &&
      (entry.name.endsWith(".js") || entry.name.endsWith(".mjs"))
    ) {
      console.log(
        `${chalk.greenBright("[SUCCESS] Slash Command Loaded:")} ${entry.name}`
      );
      const command = require(resolve(path));
      client.SlashCommands.set(command.data.name, command);
    }
  }
}

loadCommands("./slashcmds");
console.log(chalk.greenBright("Ready!"));
const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log(`${chalk.yellowBright('[WAIT] Refreshing Slash Commands')}`);

    await rest.put(Routes.applicationCommands(process.env.clientid), {
      body: client.SlashCommands.map((s) => s.data.toJSON()),
    });
    console.log(`${chalk.greenBright('[SUCCESS] Refreshed Slash Commands')}`);
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', async () => {
  for (const file of commandFiles) {
    console.log(`${chalk.greenBright('[SUCCESS] Slash Command Loaded: ')} ${file}`);
  }
});
for (const file of commandFiles) {
  const command = require(`./slashcmds/${file}`);
  client.SlashCommands.set(command.data.name, command);
}

client.on('interactionCreate', async (interaction) => {

  const command = client.SlashCommands.get(interaction.commandName);
  if (!command) return;
  console.log(`${chalk.yellowBright('[EVENT FIRED]')} interactionCreate with command ${interaction.commandName}`);

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    interaction.reply({
      embeds: [{
        description: `An error has occurred! Message <@928624781731983380> with this information: \n\`\`\`Command Name: ${interaction.comandName} \nError: ${error}\`\`\``
      }],
      ephemeral: true
    });
  }
});

/**********************************************************************/
// Start API

client.on("ready", () => {
  setInterval(function() {
    client.user.setActivity(`over ${client.guilds.cache.size} guilds.`, { type: "WATCHING" })
  }, 50000);

  var http = require('http');
  fs.readFile('./assets/count.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    commandsran = data;
    const json = {
      "guilds": `${client.guilds.cache.size}`,
      "members": `${users.size}`,
      "commandsran": `${commandsran}`,
      "commandcount": `1`
    }

    var server = http.createServer((req, res) => {
      if (req.url === '/icon.png') {
        const img = fs.readFileSync('./assets/logo.png');
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(img, 'binary');
      } else {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(JSON.stringify(json, null, 3));
      }
    });
    server.listen(80);
  });
});


/**********************************************************************/
// Login

client.login(process.env.TOKEN);