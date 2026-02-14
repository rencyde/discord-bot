const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "guildBanRemove",
  async execute(ban) {

    const logChannel = ban.guild.channels.cache.find(c => c.name === "ban-log");
    if (!logChannel) return;

    const fetchedLogs = await ban.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanRemove
    });

    const logEntry = fetchedLogs.entries.first();
    const executor = logEntry?.executor;

    logChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#2ecc71")
          .setTitle("🔓 Ban Kaldırıldı")
          .addFields(
            { name: "👤 Kullanıcı", value: ban.user.tag, inline: true },
            { name: "🛡️ Yetkili", value: executor ? executor.tag : "Bilinmiyor", inline: true }
          )
          .setTimestamp()
      ]
    });

  }
};
