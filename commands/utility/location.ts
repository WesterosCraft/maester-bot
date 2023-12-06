import {
  APIEmbed,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import matter from "gray-matter";
import slugify from "slugify";

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
  const choices = ["Kings Landing", "Winterfell", "Sunspear"];
  const filtered = choices.filter(
    (choice) =>
      choice.startsWith(focusedValue) ||
      choice.toLowerCase().startsWith(focusedValue)
  );

  await interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice }))
  );
};

interface ProjectDetails {
  title: string;
  region: string;
  projectStatus: string;
  projectType: string;
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

  if (!autocompleteResult || !query) {
    await interaction.reply({
      content: `There was an error searching for that location. Please try again.`,
      ephemeral: true,
    });
  }
  try {
    if (autocompleteResult && query) {
      const url = `https://raw.githubusercontent.com/WesterosCraft/website/main/src/content/locations/${slugify(
        query
      )}/index.mdoc`;
      const response = await fetch(url);
      const fileContent = await response.text();
      const parsedFrontMatter = matter(fileContent);
      const project: Partial<ProjectDetails> = parsedFrontMatter?.data;

      const embed = {
        color: 0x9b2c2c,
        title: project?.title,
        url:
          project?.region && project?.title
            ? `https://westeroscraft.com/locations/${slugify(
                project?.region?.toLowerCase()
              )}/${slugify(project?.title?.toLowerCase())}`
            : undefined,
        author: {
          name: "WesterosCraft",
          icon_url:
            "https://bxf03rev1vvg.keystatic.net/cm4n7v612uoj/images/tknl84bm9iug/shield?width=24&height=24",
          url: "https://westeroscraft.com/",
        },
        description: project?.description,
        // thumbnail: {
        //   url:
        //     `${project?.locationImages?.[0]?.src}?width=256&height=256&fit=crop` ||
        //     "https://bxf03rev1vvg.keystatic.net/cm4n7v612uoj/images/rww9dfay30d1/og-min?width=256&height=256&fit=cover",
        // },
        fields: [
          {
            name: "Region",
            value: project?.region || "",
          },
          {
            name: "Project Status",
            value: project?.projectStatus || "Not started",
          },
          {
            name: "Project Type",
            value: project?.projectType || "Miscellaneous",
          },
          {
            name: "House",
            value: project?.house || "Miscellaneous",
          },
          {
            name: "Warp",
            value: project?.warp || "",
          },
          // {
          //   name: "\u200b",
          //   value: "\u200b",
          //   inline: false,
          // },
          {
            name: "Date Started",
            value: project?.dateStarted || "",
            inline: true,
          },
          {
            name: "Date Completed",
            value: project?.dateCompleted || "",
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
        image: {
          url: project?.locationImages?.[0]?.src
            ? `${project?.locationImages?.[0]?.src}?width=256&height=256&fit=crop`
            : "https://bxf03rev1vvg.keystatic.net/cm4n7v612uoj/images/rww9dfay30d1/og-min?width=256&height=256&fit=cover",
        },
        timestamp: new Date().toISOString(),
        footer: {
          text: "Some footer text here",
          icon_url: "https://i.imgur.com/AfFp7pu.png",
        },
      } satisfies APIEmbed;

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } catch (error: any) {
    await interaction.reply({
      content: `There was an error searching for that location:\n\`${error?.message}\``,
      ephemeral: true,
    });
  }
};
