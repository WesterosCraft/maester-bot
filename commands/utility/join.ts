import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export const category = "utility";

export const cooldown = 60;

export const data = new SlashCommandBuilder()
  .setName("join")
  .setDescription("Provides a link to the join page.");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.reply("https://westeroscraft.com/join");
};
