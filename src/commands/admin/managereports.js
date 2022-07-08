"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Database query
const User = require("../../models/reports/user");
const Case = require("../../models/reports/cases");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 10000,
  /* in ms */
  users: new Set(),
};

module.exports.ownerOnly = {
  ownerOnly: true,
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    await interaction.deferReply();
    const sub = interaction.options.getSubcommand();
    const pin = interaction.options.getString("pin");
    const reason = interaction.options.getString("reason");

    if (sub === "accept") {
      const isValid = await User.findOne({ case: pin });
      if (!isValid)
        return interaction.followUp({
          content: `${emojis.error} | Nothing found for \`${pin}\``,
          ephemeral: true,
        });

      isValid.delete();

      const editedCase = new Case({
        pin: pin,
        status: reason
      })
      editedCase.save();

      interaction.followUp({
        content: `${emojis.success} | Successfully *accepted* \`${pin}\``,
        ephemeral: true,
      });
    } else if (sub === "decline") {
      const isValid = await User.findOne({ case: pin });
      if (!isValid)
        return interaction.followUp({
          content: `${emojis.error} | Nothing found for \`${pin}\``,
          ephemeral: true,
        });

      isValid.delete();

      const editedCase = new Case({
        pin: pin,
        status: reason
      })
      editedCase.save();
      
      interaction.followUp({
        content: `${emojis.success} | Successfully *declined* \`${pin}\``,
        ephemeral: true,
      });
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
  .setName("managereports")
  .setDescription("Accept/Decline reports")
  .addSubcommand((sub) =>
    sub
      .setName("accept")
      .setDescription("Accept a report")

      .addStringOption((option) =>
        option
          .setName("pin")
          .setDescription("Provide a pin for the case.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Provide a reason")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("decline")
      .setDescription("Decline a report")
      .addStringOption((option) =>
        option
          .setName("pin")
          .setDescription("Provide a pin for the case.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Provide a reason")
          .setRequired(true)
      )
  );
