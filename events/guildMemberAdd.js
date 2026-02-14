const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {

    const channel = member.guild.channels.cache.find(c => c.name === "giriş-log");
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("#2ecc71")
      .setTitle("👋 Yeni Üye Katıldı")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "👤 Kullanıcı", value: `${member.user.tag}`, inline: true },
        { name: "🆔 ID", value: `${member.id}`, inline: true },
        { name: "📅 Katılım", value: `<t:${Math.floor(Date.now() / 1000)}:F>` }
      )
      .setFooter({ text: "SKY BOTS Log Sistemi" })
      .setTimestamp();

    channel.send({ embeds: [embed] });
  }
};
