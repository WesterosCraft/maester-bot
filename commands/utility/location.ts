import {
  APIEmbed,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import matter from "gray-matter";
import slugify from "slugify";
import { request } from "undici";
import locations from "../../locations.json";
import { PROJECT_STATUS, PROJECT_TYPES, REGIONS } from "../../utils/constants";

export const category = "utility";

export const data = new SlashCommandBuilder()
  .setName("location")
  .setDescription("Updates a location on the WesterosCraft location list.")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("info")
      .setDescription("Info about a location")
      .addStringOption((option) =>
        option
          .setName("query")
          .setDescription("Location to search for")
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

interface ProjectDetails {
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

      const embed = {
        color: 0x9b2c2c,
        title: project?.title,
        url:
          project?.region && project?.title
            ? `https://westeroscraft.com/locations/${slugify(
                project?.region
                  ?.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2")
                  ?.toLowerCase()
              )}/${slugify(
                project?.title
                  ?.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2")
                  ?.toLowerCase()
              )}`
            : undefined,
        author: {
          name: "WesterosCraft",
          icon_url:
            "https://bxf03rev1vvg.keystatic.net/cm4n7v612uoj/images/tknl84bm9iug/shield?width=24&height=24",
          url: "https://westeroscraft.com/",
        },
        description: project?.description,
        thumbnail: project?.bannerImage?.src
          ? {
              url: `${project?.bannerImage?.src}?height=80&fit=cover`,
            }
          : undefined,
        fields: [
          {
            name: "Region",
            value: project?.region ? REGIONS[project?.region] : "",
            inline: true,
          },
          {
            name: "Project Status",
            value: project?.projectStatus
              ? PROJECT_STATUS[project?.projectStatus]
              : "Not started",
            inline: true,
          },
          {
            name: "Project Type",
            value: project?.projectType
              ? PROJECT_TYPES[project?.projectType]
              : "Miscellaneous",
            inline: true,
          },
          {
            name: "House",
            value: project?.house ?? "",
            inline: true,
          },
          {
            name: "Warp",
            value: project?.warp ?? "",
            inline: true,
          },
          {
            name: "Date Started",
            value:
              project?.dateStarted && project?.dateStarted !== "undefined"
                ? project?.dateStarted
                : "",
            inline: true,
          },
          {
            name: "Date Completed",
            value:
              project?.dateCompleted && project?.dateCompleted !== "undefined"
                ? project?.dateCompleted
                : "",
            inline: true,
          },
          {
            name: "Redo available?",
            value: project?.redoAvailable ? "Yes" : "No",
            inline: true,
          },
          {
            name: "Server project?",
            value: project?.serverProject ? "Yes" : "No",
            inline: true,
          },
        ],
        image: project?.locationImages?.[0]?.src
          ? {
              url: project?.locationImages?.[0]?.src
                ? `${project?.locationImages?.[0]?.src}?width=256&height=256&fit=crop`
                : "https://bxf03rev1vvg.keystatic.net/cm4n7v612uoj/images/rww9dfay30d1/og-min?width=256&height=256&fit=cover",
            }
          : undefined,
        timestamp: new Date().toISOString(),
        footer: project?.projectLeads
          ? {
              text: `Project leads: ${project?.projectLeads}` || "",
              // icon_url: "https://i.imgur.com/AfFp7pu.png",
            }
          : undefined,
      } satisfies APIEmbed;

      await interaction.reply({
        embeds: [embed],
        // ephemeral: true,
      });
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
