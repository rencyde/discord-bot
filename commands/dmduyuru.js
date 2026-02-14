const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dmduyuru")
    .setDescription("Belirli role sahip üyelere DM duyuru gönderir")
    .addRoleOption(option =>
      option.setName("rol")
        .setDescription("Duyurunun gönderileceği rol")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("mesaj")
        .setDescription("Gönderilecek mesaj")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    await interaction.reply({
      content: "📢 Duyuru gönderiliyor...",
      ephemeral: true
    });

    const role = interaction.options.getRole("rol");
    const message = interaction.options.getString("mesaj");

    await interaction.guild.members.fetch();

    const members = interaction.guild.members.cache.filter(member =>
      member.roles.cache.has(role.id) && !member.user.bot
    );

    let success = 0;
    let failed = 0;

    for (const [id, member] of members) {

      try {

        await member.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setAuthor({
                name: `${interaction.user.tag} tarafından gönderildi`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
              })
              .setTitle("📢 Rol Duyurusu")
              .setDescription(message)
              .addFields(
                { name: "🎭 Rol", value: role.name, inline: true },
                { name: "🏠 Sunucu", value: interaction.guild.name, inline: true }
              )
              .setTimestamp()
          ]
        });

        success++;

      } catch {
        failed++;
      }

    }

    await interaction.editReply({
      content: `✅ Duyuru tamamlandı.

🎯 Rol: **${role.name}**
📬 Gönderilen: **${success}**
❌ Gönderilemeyen: **${failed}**`
    });

  }
};
