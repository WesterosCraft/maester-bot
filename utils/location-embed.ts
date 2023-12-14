import slugify from "slugify";
import { ProjectDetails } from "../commands/utility/location";
import { PROJECT_STATUS, PROJECT_TYPES, REGIONS } from "./constants";
import { APIEmbed } from "discord.js";

export const locationEmbed = (project: Partial<ProjectDetails>) => {
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

  return embed;
};
