export const REGIONS = {
  beyondTheWall: "Beyond The Wall",
  crownlands: "Crownlands",
  dorne: "Dorne",
  ironIslands: "Iron Islands",
  north: "North",
  reach: "Reach",
  riverlands: "Riverlands",
  stormlands: "Stormlands",
  theWall: "The Wall",
  westerlands: "Westerlands",
  vale: "The Vale",
} as const;

export const PROJECT_STATUS = {
  completed: "Completed",
  inProgress: "In Progress",
  notStarted: "Not started",
  abandoned: "Abandoned",
  redoInProgress: "Redo in progress",
} as const;

export const PROJECT_TYPES = {
  castle: "Castle",
  town: "Town",
  village: "Village",
  city: "City",
  holdfast: "Holdfast",
  keep: "Keep",
  landmark: "Landmark",
  ruin: "Ruin",
  tower: "Tower",
  clan: "Clan",
  crannog: "Crannog",
  miscellaneous: "Miscellaneous",
} as const;

export const LOCATION_PROPERTIES = {
  title: "Title",
  region: "Region",
  projectStatus: "Project Status",
  projectType: "Type",
  warp: "Warp",
  house: "House",
  application: "Application",
  projectLeads: "Project Lead(s)",
  dateStarted: "Date Started",
  dateCompleted: "Date Completed",
  redoAvailable: "Redo Available",
  serverProject: "Server Project",
} as const;
