import {
  Events,
  Collection,
  CommandInteraction,
  AutocompleteInteraction,
} from "discord.js";

export const name = Events.InteractionCreate;

export const execute = async (
  interaction: CommandInteraction | AutocompleteInteraction
) => {
  if (interaction.isChatInputCommand()) {
    // @ts-ignore
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    // @ts-ignore
    const { cooldowns } = interaction.client;

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        return interaction.reply({
          content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
          ephemeral: true,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  } else if (interaction.isAutocomplete()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(error);
    }
  } else {
    return;
  }
};

// export const autocomplete = async (interaction: AutocompleteInteraction) => {
//   if (!interaction.isAutocomplete()) return;

//   const command = interaction.client.commands.get(interaction.commandName);

//   if (!command) {
//     console.error(`No command matching ${interaction.commandName} was found.`);
//     return;
//   }

//   console.log("IS AUTOCOMPLETE");
//   try {
//     await command.autocomplete(interaction);
//     return;
//   } catch (error) {
//     console.error(error);
//   }
// };
