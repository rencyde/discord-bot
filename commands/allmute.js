const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("toplumute")
    .setDescription("Belirtilen ses kanalındaki herkesi susturur")
    .addChannelOption(option =>
      option.setName("kanal")
        .setDescription("Ses kanalı seç")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

  async execute(interaction) {

    const channel = interaction.options.getChannel("kanal");

    if (channel.type !== 2) {
      return interaction.reply({
        content: "❌ Lütfen bir ses kanalı seç.",
        ephemeral: true
      });
    }

    const members = channel.members;

    if (members.size === 0) {
      return interaction.reply({
        content: "❌ Bu kanalda kimse yok.",
        ephemeral: true
      });
    }

    let mutedCount = 0;

    for (const [id, member] of members) {

      if (!member.voice.serverMute && member.id !== interaction.client.user.id) {
        try {
          await member.voice.setMute(true);
          mutedCount++;
        } catch {}
      }

    }

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🔇 Toplu Mute")
      .setDescription(`✅ **${mutedCount}** kişi susturuldu.`)
      .addFields(
        { name: "🎤 Kanal", value: channel.name, inline: true },
        { name: "🛡️ Yetkili", value: interaction.user.tag, inline: true }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};
