const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Bir kullanıcıya timeout atar")
    .addUserOption(o =>
      o.setName("kullanici")
        .setDescription("Timeout atılacak kişi")
        .setRequired(true))
    .addIntegerOption(o =>
      o.setName("dakika")
        .setDescription("Kaç dakika")
        .setRequired(true))
    .addStringOption(o =>
      o.setName("sebep")
        .setDescription("Sebep")
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {

    const user = interaction.options.getUser("kullanici");
    const minutes = interaction.options.getInteger("dakika");
    const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi";
    const member = interaction.guild.members.cache.get(user.id);

    if (!member)
      return interaction.reply({ content: "Kullanıcı bulunamadı.", ephemeral: true });

    await member.timeout(minutes * 60 * 1000, reason);

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("⏳ Timeout Atıldı")
      .addFields(
        { name: "👤 Kullanıcı", value: user.tag, inline: true },
        { name: "⏱ Süre", value: `${minutes} dakika`, inline: true },
        { name: "🛡️ Yetkili", value: interaction.user.tag },
        { name: "📌 Sebep", value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    const logChannel = interaction.guild.channels.cache.find(c => c.name === "mod-log");
    if (logChannel) logChannel.send({ embeds: [embed] });
  }
};
