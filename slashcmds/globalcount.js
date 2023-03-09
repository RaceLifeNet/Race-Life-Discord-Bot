/**********************************************************************/
// Declare Constant Variables

const { SlashCommandBuilder } = require('@discordjs/builders');
const chalk = require('chalk');
const fs = require('fs');
const https = require('https');

/**********************************************************************/
// Give Discord Command Data

module.exports = {
  data: new SlashCommandBuilder()
    .setName('globalcount')
    .setDescription("Gets Race-Life's global guild member count."),

  /**********************************************************************/
  // Acknowledge Event

  async execute(interaction, client) {
    const users = client.users.cache.filter(user => !user.bot);
    console.log(`${chalk.greenBright('[EVENT ACKNOWLEDGED]')} interactionCreate with command clear`);

    /**********************************************************************/
    // Send Response
let apistatus = "";
    try {
      const nfsheat = client.guilds.cache.get('645031540559970305');
      const nfsunbound = client.guilds.cache.get('1027513281792966677');
      const fh5 = client.guilds.cache.get('899005804202573824');
      const beammp = client.guilds.cache.get('793620741509218315');
      const ac = client.guilds.cache.get('919497844149334016');
      const portal = client.guilds.cache.get('909845427124326490');
      const media = client.guilds.cache.get('1062598637462499368');
      let totalUsers = 0;
       const url = 'https://Race-Life-Bot.frontlinegen.repl.co';

      https.get(url, (res) => {
        const { statusCode } = res;

        let error;
        if (statusCode !== 200) {
          error = new Error(`Request failed with status code ${statusCode}`);
        }

        if (error) {
          console.error(error);
          apistatus = "❎ Data API is unavailable, please check console for errors.";
        } else {
          apistatus = "✅ Data API is available, no problems detected.";
        }
      }).on('error', (error) => {
        console.error(error);      
      }),

      client.guilds.cache.forEach(guild => {
        totalUsers += guild.memberCount;
      }),
        interaction.reply({
          embeds: [{
            author: {
              name: `Race-Life`,
              icon_url: `https://cdn.discordapp.com/attachments/940019019082240030/1071933157718376448/image.png`,
              url: `https://race-life.net`
            },
            title: `Global Count`,
            description: `**${totalUsers}** users in **${client.guilds.cache.size}** guilds. 
            **${nfsheat.memberCount}** users in **[${nfsheat.name}](https://discord.gg/need-for-speed-heat-645031540559970305)**
            **${nfsunbound.memberCount}** users in **[${nfsunbound.name}](https://discord.com/need-for-speed-unbound-1027513281792966677)**
            **${fh5.memberCount}** users in **[${fh5.name}](https://discord.com/forza-horizon-5-899005804202573824)**
            **${beammp.memberCount}** users in **[${beammp.name}](https://discord.gg/aFwgwrAva4)**
            **${ac.memberCount}** users in **[${ac.name}](https://discord.gg/CaJDrEbX2B)**
            **${portal.memberCount}** users in **[${portal.name}](https://discord.gg/Q4XVa24ZAa)**
            **${media.memberCount}** users in **[${media.name}](https://discord.gg/sBqEqc7scU)**
            ${apistatus}
            `,
            footer: {
              text: `Made with ❤️ by Race-Life | race-life.net`
            },
            color: '#FF5757'
          }],
        });
    } catch (err) {
      interaction.reply({
        embeds: [{
          author: {
            name: `Race-Life`,
            icon_url: `https://endpoint.api.ostroidbot.ml/icon.png`,
            url: `https://ostroidbot.ml`
          },
          title: `It's not you, it's us.`,
          description: `We apoligise, Race-Life Bot ran into a fatal error. Please send this error message to <@!655067326227546161>. \n\`\`\`${err}\`\`\``,
          color: '#8C52FF'
        }],
        ephemeral: true
      });
    }
  }
};

