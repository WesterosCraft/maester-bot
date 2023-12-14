import slugify from "slugify";

export const getLinkFromProject = (region: string, title: string) => {
  return `https://westeroscraft.com/locations/${slugify(
    region?.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2")?.toLowerCase()
  )}/${slugify(
    title?.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2")?.toLowerCase()
  )}`;
};
