"use strict";

const { Permissions, CommandInteraction } = require("discord.js");

// Database queries
const Case = require("../../models/reports/cases");
const User = require("../../models/reports/user");

module.exports.data = {
  name: "interactionCreate",
  once: false,
};

/**
 * Handle the clients interactionCreate event.
 * @param {CommandInteraction} interaction The interaction that triggered the event.
 */
module.exports.run = async (interaction) => {
  try {
    if (!interaction.isButton()) return;

    const user = interaction.user;

    if (interaction.customId === "info-report") {
    
      interaction.reply({ content: "Any issues or need help? Make sure to open a ticket on our Discord server.", ephemeral: true });
    }
  } catch (err) {
    console.error(err);
  }
};
