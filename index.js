require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const config = require("./config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// Komut yükleme
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// 🔥 BU KISIM ÇOK ÖNEMLİ
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({ content: "Komut çalıştırılırken hata oluştu.", ephemeral: true });
    }
  }
});

// Event yükleme
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
}

client.once("clientReady", () => {
  console.log(`${client.user.tag} aktif!`);
});

client.login(config.token);
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot aktif 👑");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Web server çalışıyor.");
});
