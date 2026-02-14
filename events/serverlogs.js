const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require("../config.js");

module.exports = {
  name: "ready",
  once: false,

  async execute(client) {

    console.log("📜 Server log sistemi aktif!");

    // ===============================
    // 📥 ÜYE KATILDI
    // ===============================
    client.on("guildMemberAdd", async (member) => {

      const logChannel = member.guild.channels.cache.get(config.serverLogChannelID);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("📥 Üye Katıldı")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "👤 Kullanıcı", value: member.user.tag },
          { name: "🆔 ID", value: member.user.id }
        )
        .setTimestamp();

      logChannel.send({ embeds: [embed] });
    });

    // ===============================
    // 📤 ÜYE AYRILDI
    // ===============================
    client.on("guildMemberRemove", async (member) => {

      const logChannel = member.guild.channels.cache.get(config.serverLogChannelID);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("📤 Üye Ayrıldı")
        .addFields(
          { name: "👤 Kullanıcı", value: member.user.tag },
          { name: "🆔 ID", value: member.user.id }
        )
        .setTimestamp();

      logChannel.send({ embeds: [embed] });
    });

    // ===============================
    // 🗑️ MESAJ SİLİNDİ
    // ===============================
    client.on("messageDelete", async (message) => {

      if (!message.guild || message.author?.bot) return;

      const logChannel = message.guild.channels.cache.get(config.serverLogChannelID);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle("🗑️ Mesaj Silindi")
        .addFields(
          { name: "👤 Yazan", value: message.author.tag },
          { name: "📁 Kanal", value: message.channel.name },
          { name: "📝 İçerik", value: message.content || "Mesaj içeriği yok" }
        )
        .setTimestamp();

      logChannel.send({ embeds: [embed] });
    });

    // ===============================
    // ✏️ MESAJ DÜZENLENDİ
    // ===============================
    client.on("messageUpdate", async (oldMessage, newMessage) => {

      if (!oldMessage.guild || oldMessage.author?.bot) return;

      if (oldMessage.content === newMessage.content) return;

      const logChannel = oldMessage.guild.channels.cache.get(config.serverLogChannelID);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("✏️ Mesaj Düzenlendi")
        .addFields(
          { name: "👤 Kullanıcı", value: oldMessage.author.tag },
          { name: "📁 Kanal", value: oldMessage.channel.name },
          { name: "📌 Eski Mesaj", value: oldMessage.content || "Yok" },
          { name: "📌 Yeni Mesaj", value: newMessage.content || "Yok" }
        )
        .setTimestamp();

      logChannel.send({ embeds: [embed] });
    });

    // ===============================
    // 🎭 ROL VERİLDİ / ALINDI
    // ===============================
    client.on("guildMemberUpdate", async (oldMember, newMember) => {

      const logChannel = newMember.guild.channels.cache.get(config.serverLogChannelID);
      if (!logChannel) return;

      const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
      const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

      if (addedRoles.size > 0) {
        addedRoles.forEach(role => {
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Green")
                .setTitle("🎭 Rol Verildi")
                .addFields(
                  { name: "👤 Kullanıcı", value: newMember.user.tag },
                  { name: "🎭 Rol", value: role.name }
                )
                .setTimestamp()
            ]
          });
        });
      }

      if (removedRoles.size > 0) {
        removedRoles.forEach(role => {
          logChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Orange")
                .setTitle("❌ Rol Alındı")
                .addFields(
                  { name: "👤 Kullanıcı", value: newMember.user.tag },
                  { name: "🎭 Rol", value: role.name }
                )
                .setTimestamp()
            ]
          });
        });
      }

    });

  }
};
