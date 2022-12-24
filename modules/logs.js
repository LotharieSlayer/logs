/**
 * @author Lothaire Guée
 * @description
 * 		The file contains the functions to logs mod actions in specifics channel.
 *
 */

/*      AUTHORISATION      */
const { Logs } = require("../files/modules.js");

/*      IMPORTS      */
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { getLogsSetupData } = require("../utils/enmapUtils.js");

/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */

async function timeoutLog(oldMember, newMember, client) {
    if (Logs == false) return;

    const LOGS_ID = await getLogsSetupData(newMember.guild.id, "logs");
    if (LOGS_ID == null) return;

    const logChannel = await client.channels.cache.find(
        (channel) => channel.id === LOGS_ID
    );

    if (
        oldMember.communicationDisabledUntilTimestamp !=
            newMember.communicationDisabledUntilTimestamp ||
        (newMember.communicationDisabledUntilTimestamp ?? Infinity) < Date.now()
    ) {
        let auditLogs = await oldMember.guild.fetchAuditLogs({
            limit: 5,
            type: 24, // MEMBER_UPDATE
        });
        let timeoutFirst = auditLogs.entries.first();

        let dateNow = new Date();
        if (
            newMember.communicationDisabledUntil != null &&
            newMember.communicationDisabledUntil > dateNow
        ) {
            const timeoutEmbed = new EmbedBuilder()
                .setColor(0xe15dd9)
                .setAuthor({
                    name: `┃ ${newMember.user.username} vient d'être mute.`,
                    iconURL: newMember.user.avatarURL()
                })
                .setDescription(`(${newMember.user.id})`)
                .setTimestamp(newMember.communicationDisabledUntil)
                .setFooter({
                    text: `Par ${timeoutFirst.executor.username} jusqu'à`,
                    iconURL: timeoutFirst.executor.avatarURL()
                });
            if (timeoutFirst.reason){
                timeoutEmbed.setDescription(
                    `(${newMember.user.id})\n${timeoutFirst.reason}\n`
                );
                if(timeoutFirst.reason.startsWith("**Warn :**"))
                    timeoutEmbed.setColor("#ffcc4d");
            }

            logChannel.send({
                embeds: [timeoutEmbed],
            });
        }
    }
}

async function kickLog(member, client) {
    if (Logs == false) return;

    const LOGS_ID = await getLogsSetupData(member.guild.id, "logs");
    if (LOGS_ID == null) return;

    const logChannel = await client.channels.cache.find(
        (channel) => channel.id === LOGS_ID
    );
    let kickEmbed;

    kickEmbed = new EmbedBuilder()
        .setColor(0xe15dd9)
        .setAuthor({
            name:`┃ ${member.user.username} (${member.id}) a quitté le serveur.`,
            iconURL: member.user.avatarURL()
        })
        .setTimestamp(new Date())
        .setFooter({ text: `WhatThePhoqueBot`, iconURL: client.user.avatarURL() });

    logChannel.send({
        embeds: [kickEmbed],
    });
}

async function banLog(guildBan, banned, client) {
    if (Logs == false) return;
    const LOGS_ID = await getLogsSetupData(guildBan.guild.id, "logs");
    if (LOGS_ID == null) return;
    
    const logChannel = await client.channels.cache.find(
        (channel) => channel.id === LOGS_ID
    );

    let user = guildBan.user;
    let reason = guildBan.reason;

    let banEmbed = new EmbedBuilder()
    
    banEmbed.setColor(0xe15dd9);

    if (banned) {
        let auditLogs = await guildBan.guild.fetchAuditLogs({
            limit: 5,
            type: 22    //"MEMBER_BAN_ADD"
        });
        let banFirst = auditLogs.entries.first();
        banEmbed.setFooter({
            text: `Par ${banFirst.executor.username}`,
            iconURL: banFirst.executor.avatarURL()
        });
        banEmbed.setAuthor({
            name: `┃ ${user.username} vient d'être ban.`,
            iconURL: user.avatarURL()
        });

        if (reason){
            banEmbed.setDescription(`(${user.id})\n${reason}\n`);
            if(reason.startsWith("**Warn :**"))
                banEmbed.setColor(0xffcc4d);
        }

        logChannel.send({
            embeds: [banEmbed],
        });
    }
}

async function userLog(member) {
    const path = `${process.cwd()}/files/userEntries.log`;

    const memberLine = `${member.id} - ${new Date()} (${Date.now()})\n`;
    const startingFile =
        "╭――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――╮\n" +
        "|   ID MEMBER      |                   DATE                                            (timestamp)   |\n" +
        "╰――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――╯\n\n" +
        memberLine;

    if (fs.existsSync(path)) {
        fs.appendFile(`${path}`, memberLine, function (err) {
            if (err) throw err;
        });
    } else {
        fs.appendFile(`${path}`, startingFile, function (err) {
            if (err) throw err;
        });
    }
}

module.exports = {
    timeoutLog,
    kickLog,
    banLog,
    userLog,
};
