const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("log-kur")
    .setDescription("Tüm log kanallarını SKY BOTS kategorisine kurar")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    await interaction.deferReply({ ephemeral: true });

    // SKY BOTS kategorisi var mı kontrol et
    let category = interaction.guild.channels.cache.find(
      c => c.name === "</SKY BOTS/>" && c.type === ChannelType.GuildCategory
    );

    // Yoksa oluştur
    if (!category) {
      category = await interaction.guild.channels.create({
        name: "</SKY BOTS/>",
        type: ChannelType.GuildCategory
      });
    }

    const logs = [
      "server-log",
      "channel-log",
      "role-log",
      "ticket-log",
      "ticket-transcript",
      "timeout-log",
      "message-log",
      "ban-log",
      "giriş-log",
      "çıkış-log"
    ];

    for (const name of logs) {
      if (!interaction.guild.channels.cache.find(c => c.name === name)) {
        await interaction.guild.channels.create({
          name: name,
          type: ChannelType.GuildText,
          parent: category.id
        });
      }
    }

    await interaction.editReply("✅ SKY BOTS kategorisi ve tüm log kanalları oluşturuldu.");
  }
};
