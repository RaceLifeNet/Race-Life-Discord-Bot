/**********************************************************************/
// Declare Constant Variables

const { SlashCommandBuilder } = require('@discordjs/builders');
const chalk = require('chalk');
const fs = require('fs');

/**********************************************************************/
// Give Discord Command Data

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription("Displays the bot's current stats and info."),

  /**********************************************************************/
  // Acknowledge Event

  async execute(interaction, client) {
    const users = client.users.cache.filter(user => !user.bot);
    console.log(`${chalk.greenBright('[EVENT ACKNOWLEDGED]')} interactionCreate with command clear`);
    fs.readFile('./assets/count.txt', (err, data) => {
      if (err) throw err;
      const count = parseInt(data) + 1;
      fs.writeFile('./assets/count.txt', count.toString(), (err) => {
        if (err) throw err;
        console.log(`Updated count: ${count}`);
      });
    });

    /**********************************************************************/
    // Count Commands

    let commandcount;

    fs.readFile('./assets/commands.txt', 'utf8', (err, data) => {
      if (err) throw err;
      commandcount = data;
    })
   let commandsrun;
fs.readFile('./assets/count.txt', 'utf8', (err, data) => {
  if (err) throw err;
  commandsran = data;
})
    /**********************************************************************/
    // Send Response

try {
  interaction.reply({
    embeds: [{
      author: {
        name: `Ostroid`,
        icon_url: `https://endpoint.api.ostroidbot.ml/icon.png`,
        url: `https://ostroidbot.ml`
      },
      title: `Ostroid Information`,
      description: `Here is some information about me. (Updated: **Now**)`,
      fields: [
        {
          name: "Ping",
          value: `${client.ws.ping}ms`,
          inline: true
        },
        {
          name: "Guild Count",
          value: `${client.guilds.cache.size}`,
          inline: true
        },
        {
          name: "User Count",
          value: `${users.size}`,
          inline: true
        },
        {
          name: "Uptime",
          value: `${getUptime(client.uptime)}`,
        },
        {
          name: "Commands Ran",
          value: `${commandsran}`,
          inline: true
        },
        {
          name: "Command Count",
          value: `Hang in there - this feature is coming soon.`,
          inline: true
        }
      ],
           thumbnail: {
        url: "https://endpoint.api.ostroidbot.ml/icon.png"
      },
      footer: {
        text: `Created by Frontline Genesis | ostroidbot.ml | Version: 0.0.5`
      },
      color: '#8C52FF'
    }],
  });
    } catch (err) {
      interaction.reply({
        embeds: [{
          description: `Something went very wrong. Send this error to xWass#5848! \n\`\`\`${err}\`\`\``
        }],
        ephemeral: true
      });
    }
  }
};

/**********************************************************************/
// Uptime Humanising Script

function getUptime(uptime) {
  let uptimeSeconds = uptime / 1000;
  let days = Math.floor(uptimeSeconds / (24 * 3600));
  uptimeSeconds -= days * 24 * 3600;
  let hours = Math.floor(uptimeSeconds / 3600);
  uptimeSeconds -= hours * 3600;
  let minutes = Math.floor(uptimeSeconds / 60);
  uptimeSeconds = Math.floor(uptimeSeconds - minutes * 60);
  return `${days} days, ${hours} hours, ${minutes} minutes, ${uptimeSeconds} seconds`;
}