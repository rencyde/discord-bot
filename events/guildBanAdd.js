const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember) {

    const roleLog = newMember.guild.channels.cache.find(c => c.name === "role-log");
    const timeoutLog = newMember.guild.channels.cache.find(c => c.name === "timeout-log");

    // 🔹 ROL EKLENENLER
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

    // 🔹 ROL KALDIRILANLAR
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

    // 🔹 ROL VERME
    if (addedRoles.size > 0 && roleLog) {

      const fetchedLogs = await newMember.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberRoleUpdate
      });

      const logEntry = fetchedLogs.entries.first();
      const executor = logEntry?.executor;

      addedRoles.forEach(role => {
        roleLog.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#3498db")
              .setTitle("🎭 Rol Verildi")
              .addFields(
                { name: "👤 Kullanıcı", value: newMember.user.tag, inline: true },
                { name: "🎖️ Rol", value: role.name, inline: true },
                { name: "🛡️ Yetkili", value: executor ? executor.tag : "Bilinmiyor" }
              )
              .setTimestamp()
          ]
        });
      });
    }

    // 🔹 ROL ALMA
    if (removedRoles.size > 0 && roleLog) {

      const fetchedLogs = await newMember.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberRoleUpdate
      });

      const logEntry = fetchedLogs.entries.first();
      const executor = logEntry?.executor;

      removedRoles.forEach(role => {
        roleLog.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#e67e22")
              .setTitle("❌ Rol Alındı")
              .addFields(
                { name: "👤 Kullanıcı", value: newMember.user.tag, inline: true },
                { name: "🎖️ Rol", value: role.name, inline: true },
                { name: "🛡️ Yetkili", value: executor ? executor.tag : "Bilinmiyor" }
              )
              .setTimestamp()
          ]
        });
      });
    }

    // 🔹 TIMEOUT LOG
    if (oldMember.communicationDisabledUntil !== newMember.communicationDisabledUntil && timeoutLog) {

      timeoutLog.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#9b59b6")
            .setTitle("⏳ Timeout Güncellendi")
            .addFields(
              { name: "👤 Kullanıcı", value: newMember.user.tag },
              { name: "📅 Bitiş", value: newMember.communicationDisabledUntil
                  ? `<t:${Math.floor(new Date(newMember.communicationDisabledUntil).getTime() / 1000)}:F>`
                  : "Timeout Kaldırıldı"
              }
            )
            .setTimestamp()
        ]
      });
    }

  }
};
