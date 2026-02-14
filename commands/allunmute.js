const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("topluunmute")
    .setDescription("Ses kanalındaki herkesi mute kaldırır")
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
    let unmuted = 0;

    for (const [id, member] of members) {

      if (member.voice.serverMute) {
        try {
          await member.voice.setMute(false);
          unmuted++;
        } catch {}
      }

    }

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🔊 Toplu Unmute")
      .setDescription(`✅ **${unmuted}** kişinin susturması kaldırıldı.`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};
