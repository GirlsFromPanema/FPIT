"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 90000 /* in ms */,
  users: new Set(),
};

/**
 * Runs help command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */

module.exports.run = async (interaction, utils) => {
    
  try {

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select")
        .setPlaceholder("Select your option")
        .addOptions([
          {
            label: "👻 Utility",
            description: "Click to see Utility Commands",
            value: "first",
          },
          {
            label: "😎 FPIT",
            description: "Click to see Setup Commands",
            value: "second",
          },
        ])
    );
    let embed = new MessageEmbed()
      .setTitle("FPIT Help")
      .setDescription("Choose the Category you'd like to select")
      .setColor("GREEN");
    let sendmsg = await interaction.reply({
      content: "  ",
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });
    let embed1 = new MessageEmbed()
      .setTitle("👻 Utility")
      .setDescription(`
      - \`ping\`      - Ping the Bot
      - \`help\`      - Sends this help menu   
      `)
      .setColor("GREEN");
    let embed2 = new MessageEmbed()
      .setTitle("😎 FPIT")
      .setDescription(`
      - \`report\`  - Reports a CoC Player account
      - \`viewreport\`    - View the status of your current report
      `)
      .setColor("GREEN");
  
    const collector = interaction.channel.createMessageComponentCollector({
      componentType: "SELECT_MENU",
      time: 60000,
    });
    collector.on("collect", async (collected) => {
      const value = collected.values[0];
      if (value === "first") {
        collected.reply({ embeds: [embed1], ephemeral: true });
      }
      if (value === "second") {
        collected.reply({ embeds: [embed2], ephemeral: true });
      }
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
  .setName("help")
  .setDescription("Help Command");