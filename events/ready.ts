import { Events, Client } from "discord.js";

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
export const name = Events.ClientReady;
export const once = true;
export const execute = (client: Client) => {
  console.log(`Ready! Logged in as ${client.user?.tag}`);
};
