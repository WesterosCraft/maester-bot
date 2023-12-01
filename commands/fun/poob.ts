import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("poob")
  .setDescription("Replies with Poob!");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.reply("<:poob:1146904610259341383>");
};
