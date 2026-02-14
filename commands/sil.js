const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sil")
    .setDescription("Belirtilen sayıda mesaj siler (1-100)")
    .addIntegerOption(option =>
      option.setName("miktar")
        .setDescription("Kaç mesaj silinecek?")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {

    const amount = interaction.options.getInteger("miktar");

    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: "❌ 1 ile 100 arasında bir sayı girmelisin.",
        ephemeral: true
      });
    }

    try {

      await interaction.channel.bulkDelete(amount, true);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🧹 Mesajlar Silindi")
        .setDescription(`✅ **${amount}** adet mesaj silindi.`)
        .setFooter({ text: `İşlem yapan: ${interaction.user.tag}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } catch (err) {

      return interaction.reply({
        content: "❌ Mesajlar silinirken hata oluştu. (14 günden eski mesajlar silinemez)",
        ephemeral: true
      });
    }
  }
};
