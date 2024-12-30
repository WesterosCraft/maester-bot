module.exports = {
  apps: [ 
    {
    name: "MaesterBot",
    script: "dist/index.js",
    env: {
      NODE_ENV: 'development',
      DISCORD_TOKEN: process.env.DISCORD_TOKEN,
      DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID
    },
  }
]
}
