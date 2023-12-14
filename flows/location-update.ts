import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  MessageComponentInteraction,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
  hyperlink,
  inlineCode,
} from "discord.js";
import { ProjectDetails } from "../commands/utility/location";
import { getLinkFromProject } from "../utils/format";

import { LocationOptionsSelect } from "./selects";

export const locationUpdateFlow = async (
  interaction: ChatInputCommandInteraction,
  project: Partial<ProjectDetails>,
  autocompleteResult?: string
) => {
  const confirm = new ButtonBuilder()
    .setCustomId("confirm")
    .setLabel("Confirm")
    .setStyle(ButtonStyle.Success);

  const cancel = new ButtonBuilder()
    .setCustomId("cancel")
    .setLabel("Cancel")
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    cancel,
    confirm
  );

  if (!project.title || !autocompleteResult) {
    await interaction.reply("oops you messed up lol");
  } else {
    const response = await interaction.reply({
      content: `Found location ${hyperlink(
        project.title,
        project?.region && project?.title
          ? getLinkFromProject(project?.region, project?.title)
          : "https://westeroscraft.com/locations"
      )} based on your search ${inlineCode(
        autocompleteResult
      )}. You want to edit this location?`,
      components: [row],
      ephemeral: true,
    });

    const collectorFilter = (i: MessageComponentInteraction) =>
      i.user.id === interaction.user.id;

    try {
      const confirmation = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });

      if (confirmation.customId === "confirm") {
        const property =
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            LocationOptionsSelect(
              "property",
              `Select a property to update for ${project.title}`
            )
          );

        const category = await confirmation.reply({
          content: "Which location category do you want to edit?",
          components: [property],
          fetchReply: true,
          ephemeral: true,
        });

        const collector = category.createMessageComponentCollector({
          componentType: ComponentType.StringSelect,
          time: 3_600_000,
        });

        collector.on("collect", async (i) => {
          const selection = i.values[0];

          if (selection === "projectStatus") {
            await i.reply({
              content: `You have selected ${inlineCode("projectStatus!")}!`,
              ephemeral: true,
            });
            // const modal = new ModalBuilder()
            //   .setCustomId("myModal")
            //   .setTitle("My Modal");
            // const favoriteColorInput = new TextInputBuilder()
            //   .setCustomId("favoriteColorInput")
            //   .setLabel("What's your favorite color?")
            //   .setStyle(TextInputStyle.Short);

            // const hobbiesInput = new TextInputBuilder()
            //   .setCustomId("hobbiesInput")
            //   .setLabel("What's some of your favorite hobbies?")
            //   .setStyle(TextInputStyle.Paragraph);
            // const firstActionRow = new ActionRowBuilder().addComponents(
            //   favoriteColorInput
            // );
            // const secondActionRow = new ActionRowBuilder().addComponents(
            //   hobbiesInput
            // );

            // modal.addComponents(firstActionRow, secondActionRow);
            // await interaction.showModal(modal);
          } else {
            await i.reply({
              content: `${i.user} has selected ${inlineCode(selection)}!`,
              ephemeral: true,
            });
          }
        });

        collector?.on("end", () => {
          interaction.editReply({
            content: "Confirmation not received within 1 minute, cancelling",
            components: [],
          });
        });
      } else if (confirmation.customId === "cancel") {
        await confirmation.update({
          content: "Action cancelled",
          components: [],
        });
      }
    } catch (e) {
      console.log("ERROR---------------------------->", e);
      await interaction.editReply({
        content: "Confirmation not received within 1 minute, cancelling",
        components: [],
      });
    }
  }
};
