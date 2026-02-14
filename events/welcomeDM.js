const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",

  async execute(member) {

    const hesapYasiGun = Math.floor(
      (Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24)
    );

    const guvenlik =
      hesapYasiGun >= 30 ? "Güvenli ✅" : "Şüpheli ⚠️";

    const embed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setTitle("🎉 Hoş Geldiniz !!")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`
➤ **Kullanıcı:** ${member.user.tag}
➤ **Discord ID:** ${member.user.id}
➤ **Hesap Açılış:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:D>
➤ **Hesap Güvenliği:** ${guvenlik}

Sunucuya hoşgeldiniz.
Size otomatik rol verildiyse iyi eğlenceler dileriz!
      `)
      .setImage("https://cdn.discordapp.com/attachments/1472194018770288805/1472195438743523451/image.png?ex=6991b058&is=69905ed8&hm=817baf38d949e8dfbed9d38c8d00736b7609c5ea48d921183d187c4a849dfba0&") // Buraya kendi banner linkini koyabilirsin
      .setFooter({ text: member.guild.name })
      .setTimestamp();

    try {
      await member.send({ embeds: [embed] });
    } catch {
      console.log(`${member.user.tag} DM kapalı.`);
    }

  }
};
