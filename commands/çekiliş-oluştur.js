const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("çekiliş")
    .setDescription("Bir çekiliş başlatır")
    .addIntegerOption(option =>
      option.setName("süre")
        .setDescription("Süre (dakika)")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("ödül")
        .setDescription("Çekiliş ödülü")
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName("kazanan")
        .setDescription("Kazanan sayısı")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {

    const süre = interaction.options.getInteger("süre");
    const ödül = interaction.options.getString("ödül");
    const kazananSayısı = interaction.options.getInteger("kazanan");

    const bitis = Date.now() + süre * 60000;

    const embed = new EmbedBuilder()
      .setColor("Purple")
      .setTitle("🎉 ÇEKİLİŞ BAŞLADI!")
      .setDescription(`
🎁 **Ödül:** ${ödül}
👑 **Kazanan Sayısı:** ${kazananSayısı}
⏳ **Bitiş:** <t:${Math.floor(bitis / 1000)}:R>

Katılmak için aşağıdaki butona basın!
      `)
      .setFooter({ text: `Başlatan: ${interaction.user.username}` })
      .setTimestamp();

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cekilise_katil")
        .setLabel("🎉 Katıl")
        .setStyle(ButtonStyle.Primary)
    );

    const mesaj = await interaction.reply({
      embeds: [embed],
      components: [button],
      fetchReply: true
    });

    const katilanlar = new Set();

    const collector = mesaj.createMessageComponentCollector({
      time: süre * 60000
    });

    collector.on("collect", async i => {
      if (i.customId === "cekilise_katil") {

        if (katilanlar.has(i.user.id)) {
          return i.reply({ content: "❌ Zaten katıldın!", ephemeral: true });
        }

        katilanlar.add(i.user.id);
        i.reply({ content: "✅ Çekilişe katıldın!", ephemeral: true });
      }
    });

    collector.on("end", async () => {

      if (katilanlar.size === 0) {
        return mesaj.edit({
          content: "❌ Çekilişe kimse katılmadı.",
          embeds: [],
          components: []
        });
      }

      const kazananlar = [...katilanlar]
        .sort(() => 0.5 - Math.random())
        .slice(0, kazananSayısı);

      const kazananEtiket = kazananlar.map(id => `<@${id}>`).join(", ");

      mesaj.edit({
        content: `🎉 Tebrikler ${kazananEtiket}! **${ödül}** kazandınız!`,
        embeds: [],
        components: []
      });

    });

  }
};
