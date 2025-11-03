import { SlashCommandBuilder } from "discord.js";

export const pingCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde con pong."),

  async execute(interaction) {
    await interaction.reply("🏓 Pong!");
  },
};
