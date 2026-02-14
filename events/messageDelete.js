const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageDelete",
  async execute(message) {

    if (!message.guild || message.author?.bot) return;

    const log = message.guild.channels.cache.find(c => c.name === "message-log");
    if (!log) return;

    const embed = new EmbedBuilder()
      .setColor("#c0392b")
      .setTitle("🗑️ Mesaj Silindi")
      .addFields(
        { name: "👤 Kullanıcı", value: `${message.author.tag}`, inline: true },
        { name: "📍 Kanal", value: `${message.channel}`, inline: true },
        { name: "📝 İçerik", value: message.content || "Boş mesaj" }
      )
      .setTimestamp();

    log.send({ embeds: [embed] });
  }
};
