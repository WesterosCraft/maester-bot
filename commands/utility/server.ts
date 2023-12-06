import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export const category = "utility";

export const data = new SlashCommandBuilder()
  .setName("server")
  .setDescription("Provides information about the server.");

export const execute = async (interaction: CommandInteraction) => {
  // interaction.guild is the object representing the Guild in which the command was run
  await interaction.reply(
    `This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members.`
  );
};
