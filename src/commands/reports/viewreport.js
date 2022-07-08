"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");

// Database queries
const Case = require("../../models/reports/cases");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 90000,
  /* in ms */
  users: new Set(),
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    const pin = interaction.options.getString("case");

    const isValid = await Case.findOne({ pin: pin });
    if (!isValid)
      return interaction.reply({
        content: `${emojis.error} | \`${pin}\` is not valid or hasn't been accepted/declined yet. Try again later.`,
        ephemeral: true,
      });

    const status = isValid.status;
    const user = interaction.user;

    const userdmrow = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("SECONDARY")
        .setEmoji("❓")
        .setCustomId("info-report")
    );

    const embed = new MessageEmbed()
      .setTitle(`${emojis.notify} FPIT information`)
      .setDescription(
        `
        Hello there, ${interaction.user.tag}.\nHere is the current status of your report.
        
        Case: \`${pin}\`
        Status: \`${status}\`
        `
      )
      .setTimestamp();

    try {
      await user.send({ embeds: [embed], components: [userdmrow] });
    } catch (error) {
      console.log(error);
      return;
    }
    interaction.reply({
      content: `${emojis.success} | Successfully sent you the current status.\nIf you haven't received anything, please enable your direct messages.`,
      ephemeral: true,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.SEND_MESSAGES],
};

module.exports.data = new SlashCommandBuilder()
  .setName("viewreport")
  .setDescription("Check if your report has been accepted/declined")
  .addStringOption((option) =>
    option
      .setName("case")
      .setDescription("Enter the Case ID of your report.")
      .setRequired(true)
  );
