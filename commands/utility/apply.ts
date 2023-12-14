import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export const category = "utility";

export const data = new SlashCommandBuilder()
  .setName("apply")
  .setDescription("Lets a user apply to build on WesterosCraft.");

// apply flow

// 1. user types /apply
// 2. message appears that says "STOP! read before continuing!" provide links to rules, faq etc.
// then ask if they want to proceed, and click a continue or cancel button

export const execute = async (interaction: CommandInteraction) => {
  // interaction.user is the object representing the User who ran the command
  // interaction.member is the GuildMember object, which represents the user in the specific guild
  await interaction.reply(
    `This command was run by ${interaction.user.username}`
  );
};
