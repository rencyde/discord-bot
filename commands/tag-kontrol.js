const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");
const config = require("../config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tagkontrol")
    .setDescription("İsminde sunucu tagı olmayanları listeler")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {

    await interaction.reply({
      content: "🔍 Üyeler kontrol ediliyor...",
      ephemeral: true
    });

    await interaction.guild.members.fetch();

    const members = interaction.guild.members.cache.filter(member =>
      !member.user.bot &&
      !member.displayName.includes(config.tag)
    );

    if (members.size === 0) {
      return interaction.editReply({
        content: "✅ Herkes tag almış!"
      });
    }

    const list = members.map(m => `${m.user.tag}`).slice(0, 50);

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("❌ Tag Almayan Üyeler")
      .setDescription(list.join("\n"))
      .setFooter({
        text: `Toplam: ${members.size} kişi`
      })
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });

  }
};
