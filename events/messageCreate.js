const fs = require("fs");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    let data = {};
    try {
      data = JSON.parse(fs.readFileSync("./data/aktiflik.json"));
    } catch {}

    data[message.author.id] = (data[message.author.id] || 0) + 1;

    fs.writeFileSync("./data/aktiflik.json", JSON.stringify(data, null, 2));
  }
};
