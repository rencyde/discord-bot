const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forceban")
    .setDescription("Sunucuda olmayan bir kullanıcıyı ID ile banlar")
    .addStringOption(option =>
      option.setName("kullanıcı_id")
        .setDescription("Banlanacak kişinin ID'si")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("sebep")
        .setDescription("Ban sebebi")
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {

    const userId = interaction.options.getString("kullanıcı_id");
    const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi.";

    // ID kontrol (sayı mı?)
    if (!/^\d+$/.test(userId)) {
      return interaction.reply({
        content: "❌ Geçerli bir kullanıcı ID gir!",
        ephemeral: true
      });
    }

    try {

      await interaction.guild.members.ban(userId, {
        reason: `${reason} | Yetkili: ${interaction.user.tag}`
      });

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🔨 Force Ban Atıldı")
        .addFields(
          { name: "👤 Kullanıcı ID", value: userId },
          { name: "📝 Sebep", value: reason },
          { name: "👮 Yetkili", value: interaction.user.tag }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (err) {

      console.error(err);

      interaction.reply({
        content: "❌ Ban işlemi başarısız! Yetkim yetersiz olabilir.",
        ephemeral: true
      });

    }

  }
};
