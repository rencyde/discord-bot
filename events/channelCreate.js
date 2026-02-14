const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "channelCreate",
  async execute(channel) {

    const logChannel = channel.guild.channels.cache.find(c => c.name === "channel-log");
    if (!logChannel) return;

    const fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelCreate
    });

    const logEntry = fetchedLogs.entries.first();
    const executor = logEntry?.executor;

    logChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#2ecc71")
          .setTitle("📁 Kanal Oluşturuldu")
          .addFields(
            { name: "📌 Kanal", value: channel.name, inline: true },
            { name: "🛡️ Yetkili", value: executor ? executor.tag : "Bilinmiyor" }
          )
          .setTimestamp()
      ]
    });

  }
};
