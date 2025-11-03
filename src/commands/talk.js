import { SlashCommandBuilder } from "discord.js";

export const talkCommand = {
  data: new SlashCommandBuilder()
    .setName("talk")
    .setDescription("Hacé que el bot diga algo.")

    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("El mensaje que quieres que diga el bot.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const message = interaction.options.getString("message");
    await interaction.reply(message);
  },
};

export default talkCommand;
