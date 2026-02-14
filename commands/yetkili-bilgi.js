const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yetkili-bilgi")
    .setDescription("Yetkili mesaj sayısını gösterir")
    .addUserOption(o =>
      o.setName("kullanici")
        .setDescription("Yetkili")
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser("kullanici");

    let data = {};
    try {
      data = JSON.parse(fs.readFileSync("./data/aktiflik.json"));
    } catch {}

    const mesaj = data[user.id] || 0;

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("📊 Yetkili İstatistik")
      .addFields({ name: "Mesaj Sayısı", value: mesaj.toString() })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};
