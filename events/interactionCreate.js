const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const transcript = require("discord-html-transcripts");
const config = require("../config.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {

    // SADECE BUTONLAR
    if (!interaction.isButton()) return;

    // ===============================
    // 🎟️ TICKET AÇMA
    // ===============================
    if (interaction.customId === "ekip_basvuru") {

      const username = interaction.user.username
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, "");

      const channel = await interaction.guild.channels.create({
        name: `başvuru-${username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory
            ]
          }
        ]
      });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("ticket_kapat")
          .setLabel("🔒 Ticket Kapat")
          .setStyle(ButtonStyle.Danger)
      );

      await channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🎟️ Başvuru Ticketi")
            .setDescription(
              `👋 Hoş geldin ${interaction.user}\n\n` +
              `Başvurunu detaylı şekilde yaz.\n\n` +
              `İşin bitince aşağıdan kapatabilirsin.`
            )
            .setTimestamp()
        ],
        components: [row]
      });

      await interaction.reply({
        content: `✅ Ticket oluşturuldu: ${channel}`,
        ephemeral: true
      });
    }

    // ===============================
    // 🔒 TICKET KAPATMA
    // ===============================
    if (interaction.customId === "ticket_kapat") {

      await interaction.reply({
        content: "🔒 Ticket kapatılıyor...",
        ephemeral: true
      });

      setTimeout(() => {
        interaction.channel.delete().catch(() => {});
      }, 3000);
    }
  }
};
