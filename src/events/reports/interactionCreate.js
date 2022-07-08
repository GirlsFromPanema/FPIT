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

    if (interaction.customId === "claim-report") {
    
      let row = interaction.message.components[0];

      // disable the button once its clicked
      row.components.map((component) => component.setDisabled(true));
      interaction.update({ components: [row] });

      await user.send({ content: "Successfully claimed report!\nPlease use \`/managereports <accept/decline>\` once the village is banned." });
    }
  } catch (err) {
    console.error(err);
  }
};
