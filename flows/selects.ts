import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { REGIONS, LOCATION_PROPERTIES } from "../utils/constants";

export const LocationOptionsSelect = (customId: string, placeholder: string) =>
  new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(placeholder)
    .addOptions(
      Object.entries(LOCATION_PROPERTIES).map(([key, value]) =>
        new StringSelectMenuOptionBuilder().setLabel(value).setValue(key)
      )
    );

export const REGION_OPTIONS = (customId: string, placeholder: string) =>
  new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(placeholder)
    .addOptions(
      Object.entries(REGIONS).map(([key, value]) =>
        new StringSelectMenuOptionBuilder().setLabel(value).setValue(key)
      )
    );
