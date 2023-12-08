import { request } from "undici";
import fs from "node:fs";

// This uses the github api to get the locations.json file from directories on github

const GITHUB_CONFIG = {
  owner: "WesterosCraft",
  repo: "website",
  path: "src/content/locations",
};

interface Datum {
  name: string;
  path: string;
  type: string;
}

function toTitleCase(slug: string): string {
  // Split the slug into words by hyphens and spaces
  const words = slug.split(/[- ]+/);

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
  );

  // Join the words back together with spaces
  return capitalizedWords.join(" ");
}

(async () => {
  try {
    console.log(
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`
    );
    const response = await request(
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`,
      { headers: { "User-Agent": "request" } }
    );

    const data = await response.body.json();
    const subdirectories = (data as Datum[])
      .filter((item) => item.type === "dir")
      .map((item) => ({ slug: item.name, title: toTitleCase(item?.name) }));

    fs.writeFileSync("locations.json", JSON.stringify(subdirectories));
  } catch (error: unknown) {
    console.error(error);
  }
})();
