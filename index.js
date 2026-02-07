const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const config = require('./config.json');

// Bot oluştur
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates, // Ses kanalı için gerekli
  ],
  partials: [Partials.Channel],
});

// Komutları sakla
client.commands = new Collection();
client.prefixCommands = new Collection(); // ✅ Prefix komutlar için eklendi

// 🔹 Komutları commands klasöründen yükle
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  
  // ✅ Slash komutları
  if (command?.data?.name && typeof command.execute === "function") {
    client.commands.set(command.data.name, command);
    console.log(`✅ Slash komut yüklendi: ${command.data.name}`);
  }
  // ✅ Prefix komutları
  else if (command?.name && typeof command.execute === "function") {
    client.prefixCommands.set(command.name, command);
    console.log(`✅ Prefix komut yüklendi: ${command.name}`);
  } else {
    console.warn(`[WARN] ${file} -> "data.name" veya "name" veya "execute" eksik olabilir.`);
  }
}

// 🔹 Olayları (events) yükle
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// ✅ Prefix Komut Handler eklendi
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('.')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.prefixCommands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(`Prefix komut hatası (${commandName}):`, error);
    message.reply('Komutta bir hata oluştu!').catch(() => {});
  }
});

// Bot hazır olduğunda
client.once('ready', async () => {
  console.log(`Bot giriş yaptı: ${client.user.tag}`);
  
  // 🎯 Bot durumunu ayarla
  if (config.durum) {
    client.user.setPresence({
      activities: [{ 
        name: config.durum, 
        type: ActivityType.Playing
      }],
      status: 'online'
    });
    console.log(` Bot durumu ayarlandı: ${config.durum}`);
  }
  
  // 🔊 Ses kanalına gir
  if (config.sesKanalId) {
    try {
      const channel = await client.channels.fetch(config.sesKanalId);
      if (channel && channel.isVoiceBased()) {
        const { joinVoiceChannel } = require('@discordjs/voice');
        
        const connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
        
        console.log(` Ses kanalına bağlandı: ${channel.name}`);
      } else {
        console.log('❌ Ses kanalı bulunamadı veya ses kanalı değil!');
      }
    } catch (error) {
      console.error('❌ Ses kanalına bağlanırken hata:', error);
    }
  }
});

// Slash komutu çalıştırma
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Komutu çalıştırırken bir hata oluştu!', ephemeral: true });
  }
});

// Botu başlat
client.login(config.token);
