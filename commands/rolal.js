const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rolal")
    .setDescription("Bir kullanıcıdan rol alır")
    .addUserOption(option =>
      option.setName("kullanici")
        .setDescription("Rol alınacak kişi")
        .setRequired(true))
    .addRoleOption(option =>
      option.setName("rol")
        .setDescription("Alınacak rol")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {

    const user = interaction.options.getUser("kullanici");
    const role = interaction.options.getRole("rol");
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: "❌ Kullanıcı bulunamadı.", ephemeral: true });
    }

    if (!member.roles.cache.has(role.id)) {
      return interaction.reply({ content: "❌ Kullanıcıda bu rol yok.", ephemeral: true });
    }

    try {

      await member.roles.remove(role);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("❌ Rol Alındı")
        .addFields(
          { name: "👤 Kullanıcı", value: user.tag, inline: true },
          { name: "🎭 Rol", value: role.name, inline: true },
          { name: "🛡️ Yetkili", value: interaction.user.tag }
        )
        .setTimestamp();

      interaction.reply({ embeds: [embed] });

    } catch {
      interaction.reply({ content: "❌ Rol alınırken hata oluştu. Bot rolü üstte mi?", ephemeral: true });
    }
  }
};
