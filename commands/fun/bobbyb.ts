import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import QUOTES from "../../utils/quotes.json";

export const data = new SlashCommandBuilder()
  .setName("bobbyb")
  .setDescription("Replies with King Robert Baratheon quotes");

export const execute = async (interaction: CommandInteraction) => {
  const emoji = interaction.client.emojis.cache.find(
    (emoji) => emoji.name === "bobbyb"
  );

  const item = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  await interaction.reply(`${emoji} ${item}`);
};

export const cooldown = 5;
