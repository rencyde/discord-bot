const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ekip-başvurusu")
    .setDescription("Ekip başvuru panelini gönderir"),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("📩 Ekip Başvuru Sistemi")
      .setDescription("➜ Ekip Başvuru Hakkında:\nAşağıdaki butona tıklayarak başvuru ticketi oluşturabilirsiniz.\n\n➜ Sunucu Bilgisi:\nKuralları okumayı unutmayın.")
      .setImage("https://cdn.discordapp.com/attachments/1472194018770288805/1472195438743523451/image.png?ex=6991b058&is=69905ed8&hm=817baf38d949e8dfbed9d38c8d00736b7609c5ea48d921183d187c4a849dfba0&")
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ekip_basvuru")
        .setLabel("📩 Ekip Başvuru")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
