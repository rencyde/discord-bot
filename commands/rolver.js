const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rolver")
    .setDescription("Bir kullanıcıya rol verir")
    .addUserOption(option =>
      option.setName("kullanici")
        .setDescription("Rol verilecek kişi")
        .setRequired(true))
    .addRoleOption(option =>
      option.setName("rol")
        .setDescription("Verilecek rol")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {

    const user = interaction.options.getUser("kullanici");
    const role = interaction.options.getRole("rol");
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: "❌ Kullanıcı bulunamadı.", ephemeral: true });
    }

    if (member.roles.cache.has(role.id)) {
      return interaction.reply({ content: "❌ Kullanıcıda bu rol zaten var.", ephemeral: true });
    }

    try {

      await member.roles.add(role);

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("✅ Rol Verildi")
        .addFields(
          { name: "👤 Kullanıcı", value: user.tag, inline: true },
          { name: "🎭 Rol", value: role.name, inline: true },
          { name: "🛡️ Yetkili", value: interaction.user.tag }
        )
        .setTimestamp();

      interaction.reply({ embeds: [embed] });

    } catch {
      interaction.reply({ content: "❌ Rol verilirken hata oluştu. Bot rolü üstte mi?", ephemeral: true });
    }
  }
};
