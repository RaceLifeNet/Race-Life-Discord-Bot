const { SlashCommandBuilder } = require('@discordjs/builders');
const chalk = require('chalk');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('apod')
    .setDescription("Gets the current NASA Astronomy Picture of the Day."),

  async execute(interaction, client) {
    console.log(`${chalk.greenBright('[EVENT ACKNOWLEDGED]')} interactionCreate with command clear`);
    // Read the current value from the file
    fs.readFile('count.txt', (err, data) => {
      if (err) throw err;

      // Increment the value
      const count = parseInt(data) + 1;

      // Convert the count to a string and write it to the file
      fs.writeFile('count.txt', count.toString(), (err) => {
        if (err) throw err;
        console.log(`Updated count: ${count}`);
      });
    });
    try {
      interaction.reply({
        embeds: [{
          title: `${client.ws.ping}ms`,
          description: `${client.ws.ping}ms`,
          footer: {
            text: `${client.ws.ping}ms`
          },
          color: 'GREEN'
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

