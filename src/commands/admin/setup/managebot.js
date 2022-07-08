"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Database query
const Guild = require("../../../models/admin/setup");

// Configs
const emojis = require("../../../../Controller/emojis/emojis");

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

    if (sub === "setup") {
      const isSetup = await Guild.findOne({ id: interaction.guild.id });
      const channel =
        interaction.options.getChannel("channel") || interaction.channel;

      if (!isSetup) {
        if (channel.type != "GUILD_TEXT") {
          interaction.followUp({
            content: `${emojis.error} | This is not a valid channel!`,
            ephemeral: true,
          });
          return;
        }

        let webhookid;
        let webhooktoken;

        let newwebhook = await channel
          .createWebhook("Reports", {
           // avatar:
           //   "https://media.discordapp.net/attachments/937076782404878396/941768103807840336/Zofia_Hund_R6.jpg?width=664&height=648",
          })
          .then((webhook) => {
            webhookid = webhook.id;
            webhooktoken = webhook.token;
          });

        const newLogs = new Guild({
          id: interaction.guild.id,
          channel: channel.id,
          webhookid: webhookid,
          webhooktoken: webhooktoken,
        });
        newLogs.save();

        interaction.followUp({
          content: `${emojis.success} | Successfully set the channel to ${channel}`,
          ephemeral: true,
        });
      } else {
        if (channel.type != "GUILD_TEXT") {
          interaction.followUp({
            content: `${emojis.error} | This is not a valid channel!`,
            ephemeral: true,
          });
          return;
        }

        let webhookid;
        let webhooktoken;

        let newwebhook = await channel
          .createWebhook("Reports", {
          //  avatar:
          //    "https://media.discordapp.net/attachments/937076782404878396/941768103807840336/Zofia_Hund_R6.jpg?width=664&height=648",
          })
          .then((webhook) => {
            webhookid = webhook.id;
            webhooktoken = webhook.token;
          });

        await Guild.findOneAndUpdate({
          id: interaction.guild.id,
          channel: channel.id,
          webhookid: webhookid,
          webhooktoken: webhooktoken,
        });
        await interaction.reply({
          content: `🌀 | Successfully changed logging channel to ${channel}`,
          ephemeral: true,
        });
      }
    } else if (sub === "remove") {
      const isSetup = await Guild.findOne({ id: interaction.guild.id });
      if (!isSetup)
        return interaction.followUp({
          content: `${emojis.error} | No setup found.`,
          ephemeral: true,
        });

      isSetup.delete();
      interaction.followUp({
        content: `${emojis.success} | Successfully removed setup`,
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
  .setName("managebot")
  .setDescription("Setup/Remove bot setup")
  .addSubcommand((sub) =>
    sub
      .setName("setup")
      .setDescription("Setup bot setup")

      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Select the channel for sending the bot messages")
          .setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub.setName("remove").setDescription("Remove system setup.")
  )