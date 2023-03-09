const { SlashCommandBuilder } = require('@discordjs/builders');
const chalk = require('chalk');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('globalban')
    .setDescription('Bans a user globally from the Race-Life network.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban from all guilds (ID)')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('notify')
        .setDescription('Whether to notify the banned user or not')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The ban message to be sent to the banned user')
        .setRequired(false)),

  async execute(interaction, client) {
    console.log(`${chalk.greenBright('[EVENT ACKNOWLEDGED]')} interactionCreate with command clear`);

    // Verify if user is an administrator
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });
      return;
    }

    try {
      const userId = interaction.options.getUser('user').id;
      const memberToBan = await client.users.fetch(userId);
      const notify = interaction.options.getBoolean('notify') ?? true; // Default to true if not provided
      const message = interaction.options.getString('message') ?? 'You have been banned from all guilds in the Race-Life network.';

      // Send initial message
      const reply = await interaction.reply({
        content: '🟡 Global ban API call scheduled.',
        ephemeral: true,
      });

      // Ban the member from all guilds
      client.guilds.cache.forEach(async guild => {
        try {
          const banningUser = interaction.user.tag;
          const guildMember = await guild.members.fetch(memberToBan);
          const banOptions = {
            reason: `Banned from all guilds by ${banningUser}`,
          };
          if (!notify) {
            banOptions.days = 7; // Ban without notifying and delete messages from the past 7 days
          }
          await guildMember.ban(banOptions);
          await guildMember.send(message); // Send ban message to banned user
        } catch (error) {
          // If the user is not found in the guild, add them to the ban list
          if (error.code === 10007) {
            console.log(`User ${memberToBan.tag} is not a member of guild ${guild.name}`);
          } else {
            console.error(`Failed to ban member from guild ${guild.name}: ${error}`);
          }
        }
      });

      // Add the user to the ban list if they were not found in any guilds
      if (!client.guilds.cache.some(guild => guild.members.cache.has(memberToBan.id))) {
        console.log(`User ${memberToBan.tag} is not a member of any guilds`);
        // Add the user ID to your ban list here
      }

      // Edit initial message to "Global ban complete"
      await reply.edit('🟢 Global ban complete.');

    } catch (error) {
      // Send error message
      interaction.reply({
        content: 'An error occurred while processing the command. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
