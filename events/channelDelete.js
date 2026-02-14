const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "channelDelete",
  async execute(channel) {

    const logChannel = channel.guild.channels.cache.find(c => c.name === "channel-log");
    if (!logChannel) return;

    const fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelDelete
    });

    const logEntry = fetchedLogs.entries.first();
    const executor = logEntry?.executor;

    logChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#e74c3c")
          .setTitle("🗑️ Kanal Silindi")
          .addFields(
            { name: "📌 Kanal", value: channel.name },
            { name: "🛡️ Yetkili", value: executor ? executor.tag : "Bilinmiyor" }
          )
          .setTimestamp()
      ]
    });

  }
};
