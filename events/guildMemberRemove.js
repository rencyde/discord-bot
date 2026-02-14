const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {

    const channel = member.guild.channels.cache.find(c => c.name === "çıkış-log");
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("#e74c3c")
      .setTitle("🚪 Üye Ayrıldı")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "👤 Kullanıcı", value: `${member.user.tag}`, inline: true },
        { name: "🆔 ID", value: `${member.id}`, inline: true }
      )
      .setFooter({ text: "SKY BOTS Log Sistemi" })
      .setTimestamp();

    channel.send({ embeds: [embed] });
  }
};
