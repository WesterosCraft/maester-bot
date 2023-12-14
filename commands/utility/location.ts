import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  GuildMemberRoleManager,
  SlashCommandBuilder,
} from "discord.js";
import matter from "gray-matter";
import slugify from "slugify";
import { request } from "undici";
import locations from "../../locations.json";
import { PROJECT_STATUS, PROJECT_TYPES, REGIONS } from "../../utils/constants";
import { locationEmbed } from "../../utils/location-embed";
import { locationUpdateFlow } from "../../flows/location-update";

export const category = "utility";

const SUBCOMMANDS = {
  INFO: "info",
  UPDATE: "update",
} as const;

export const data = new SlashCommandBuilder()
  .setName("location")
  .setDescription("Updates a location on the WesterosCraft location list.")
  .addSubcommand((subcommand) =>
    subcommand
      .setName(SUBCOMMANDS.INFO)
      .setDescription("Info about a location")
      .addStringOption((option) =>
        option
          .setName("query")
          .setDescription("Location to search for")
          .setAutocomplete(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName(SUBCOMMANDS.UPDATE)
      .setDescription("Update a location")
      .addStringOption((option) =>
        option
          .setName("query")
          .setDescription("Location to update")
          .setAutocomplete(true)
      )
  );

export const autocomplete = async (interaction: AutocompleteInteraction) => {
  const focusedValue = interaction.options.getFocused();

  if (focusedValue.length > 3) {
    const filtered = locations.filter(
      (choice) =>
        choice.title.startsWith(focusedValue) ||
        choice.title.toLowerCase().startsWith(focusedValue)
    );

    await interaction.respond(
      filtered.map((choice) => ({ name: choice.title, value: choice.slug }))
    );
  }
};

export interface ProjectDetails {
  title: string;
  region: keyof typeof REGIONS;
  projectStatus: keyof typeof PROJECT_STATUS;
  projectType: keyof typeof PROJECT_TYPES;
  warp: string;
  house: string;
  application: string;
  projectLeads: string;
  dateStarted: string;
  dateCompleted: string;
  difficultyLevel: string;
  redoAvailable: boolean;
  description: string;
  serverProject: boolean;
  dynmapLink?: string;
  bannerImage?: {
    src: string;
    height: number;
    width: number;
  };
  locationImages?: Array<{ src: string }>;
}

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const autocompleteResult = interaction.options.get("query");
  const query = autocompleteResult?.value?.toString()?.toLowerCase();
  const roles = (interaction.member?.roles as GuildMemberRoleManager)?.cache;
  const isGuest = roles.some((role) => role?.name === "guests");

  if (!autocompleteResult || !query || query === "invalid") {
    await interaction.reply({
      content: `There was an error searching for that location. Please try again.`,
      ephemeral: true,
    });
  }

  try {
    if (autocompleteResult && query) {
      const result = await request(
        `https://raw.githubusercontent.com/WesterosCraft/website/main/src/content/locations/${slugify(
          query
        )}/index.mdoc`
      );

      if (result.statusCode === 404) {
        throw new Error(`${query}`);
      }

      const fileContent = await result.body.text();
      const parsedFrontMatter = matter(fileContent);
      const project: Partial<ProjectDetails> = parsedFrontMatter?.data;

      if (interaction.options.getSubcommand() === SUBCOMMANDS.INFO) {
        const embed = locationEmbed(project);

        await interaction.reply({
          embeds: [embed],
          // ephemeral: true,
        });
      }

      if (interaction.options.getSubcommand() === SUBCOMMANDS.UPDATE) {
        if (isGuest) {
          return interaction.reply({
            content: "You do not have permission to use this command.",
            ephemeral: true,
          });
        } else {
          await locationUpdateFlow(
            interaction,
            project,
            autocompleteResult?.value?.toString()
          );
        }
      }
    }
  } catch (error: any) {
    await interaction.reply({
      content: `There was an error searching for that location${
        error?.message ? `: ${error?.message}` : ``
      }`,
      ephemeral: true,
    });
  }
};
