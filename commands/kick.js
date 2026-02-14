const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Bir kullanıcıyı atar")
    .addUserOption(o =>
      o.setName("kullanici")
        .setDescription("Atılacak kişi")
        .setRequired(true))
    .addStringOption(o =>
      o.setName("sebep")
        .setDescription("Sebep")
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {

    const user = interaction.options.getUser("kullanici");
    const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi";
    const member = interaction.guild.members.cache.get(user.id);

    if (!member)
      return interaction.reply({ content: "Kullanıcı bulunamadı.", ephemeral: true });

    await member.kick(reason);

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("👢 Kullanıcı Atıldı")
      .addFields(
        { name: "👤 Kullanıcı", value: user.tag, inline: true },
        { name: "🛡️ Yetkili", value: interaction.user.tag, inline: true },
        { name: "📌 Sebep", value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    const logChannel = interaction.guild.channels.cache.find(c => c.name === "mod-log");
    if (logChannel) logChannel.send({ embeds: [embed] });
  }
};
