"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed, WebhookClient, MessageActionRow, MessageButton } = require("discord.js");
const { Client, Util } = require("clashofclans.js");

const cocToken = process.env.COC_API_KEY;
const coc = new Client({
  keys: [cocToken],
});

// Database query
const User = require("../../models/reports/user");
const Guild = require("../../models/admin/setup");

// Configs
const emojis = require("../../../Controller/emojis/emojis");
const config = require("../../../Controller/owners.json");
const { stripIndents } = require("common-tags");

// Owner configs
const adminguild = config.guild;
const adminchannel = config.channel;

// generate a random case ID
function generateID() {
  var length = 12,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

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
    await interaction.deferReply();
    const tag = interaction.options.getString("tag");
    const reason = interaction.options.getString("reason");
    const pin = generateID();

    const guildQuery = await Guild.findOne({ id: interaction.guild.id });
    
    if (!Util.isValidTag(Util.formatTag(tag))) {
      return interaction.followUp({
        content: `${emojis.error} | \`${tag}\` isn't a valid tag!`,
        ephemeral: true,
      });
    }

    const guild = await interaction.client.guilds.fetch(adminguild);
    const reportchannel = await guild.channels.fetch(adminchannel);
    if (!guild || !reportchannel)
      return interaction.followUp({
        content: `${emojis.error} | Reports are currently disabled, try again later.`,
        ephemeral: true,
      });

    // fetch the accounts data
    const data = await coc.getPlayer(tag).catch((err) => {
      console.log(err);
      return { ok: false, status: err.code, name: err.message };
    });

    const hasOpenReport = await User.findOne({ userID: interaction.user.id });
    if (hasOpenReport)
      return interaction.followUp({
        content: `${emojis.error} | You can only report one player at once.`,
        ephemeral: true,
      });

    const newReport = new User({
      userID: interaction.user.id,
      tag: tag,
      case: pin,
    });
    newReport.save();

    const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setStyle("SECONDARY")
      .setEmoji("🙋🏽‍♂️")
      .setCustomId("claim-report")
    )
   
    const userdmrow = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setStyle("SECONDARY")
      .setEmoji("❓")
      .setCustomId("info-report")
    )
    
    const embed = new MessageEmbed()
      .setTitle(`${emojis.notify} New Report`)
      .setDescription(
        `
        A new Player has been reported with the tag: \`${tag}\` and the following reason: \`${reason}\`\n\n**Reporter information:**\nUser: ${
          interaction.user.tag
        }\nGuild: ${interaction.guild.name}\n\n**Account information:**
        [View inGame](https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${encodeURIComponent(
          data.tag
        )})

        Name:
		\`${data.name}\`
        Tag:
		\`${data.tag}\`
        Town Hall:
		\`${data.townHallLevel}\`
		XP:
		\`${data.expLevel}\`
        `
      )
      .setColor("GREEN")
      .setFooter({
        text: `PIN: ${pin}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(
        interaction.user.displayAvatarURL({ dynamic: true, size: 512 })
      )
      .setTimestamp();

    const userembed = new MessageEmbed()
      .setTitle(`${emojis.notify} FPIT information`)
      .setDescription(
        `
        Hey there ${interaction.user.tag}, you have recently reported a player to FPIT: \`${tag}\` with the following reason: \`${reason}\`

        Name:
		\`${data.name}\`
        Tag:
		\`${data.tag}\`
        Town Hall:
		\`${data.townHallLevel}\`
		XP:
		\`${data.expLevel}\`
      
    It can take up to 7 days until your request has been managed by the Admins. If you want to check if your report is still active, run \`/viewreport <case_id>\`.
    
    `
      )
      .setColor("GREEN")
      .setFooter({
        text: `Case: ${pin}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(
        interaction.user.displayAvatarURL({ dynamic: true, size: 512 })
      )
      .setTimestamp();

    await reportchannel.send({ embeds: [embed], components: [row] });
    const user = interaction.user;

    await interaction.followUp({
      content: `${emojis.success} | Successfully sent report!\nPlease check your \`direct messages\` for more details.`,
      ephemeral: true,
    });

    try {
      user.send({ embeds: [userembed] });
    } catch (error) {
      console.log(error);
      return;
    }

    const logembed = new MessageEmbed()
    .setDescription(`${emojis.review} A new player has been reported!`)
    .setFooter({ text: "Want to report a player? Run /report"})
    .setColor("NOT_QUITE_BLACK")
    .setTimestamp()

    if (!guildQuery) return;
    if (guildQuery) {
      const webhookid = guildQuery.webhookid;
      const webhooktoken = guildQuery.webhooktoken;

      const webhookClient = new WebhookClient({ id: webhookid, token: webhooktoken });
    
      webhookClient.send({ embeds: [logembed], components: [userhelp] });
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.SEND_MESSAGES],
};

module.exports.data = new SlashCommandBuilder()
  .setName("report")
  .setDescription("Report a player to FPIT")
  .addStringOption((option) =>
    option
      .setName("tag")
      .setDescription("Please type the player tag.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Please enter the reason for the report.")
      .setRequired(true)
  );
