/**
 * @author Lothaire Guée
 * @description
 *      This event is used to track member who entered.
 */


const { userLog } = require("../modules/logs");


/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */
/**
 * Function called when the event 'guildMemberAdd' is emitted.
 * @param {GuildMember} member The new member object.
 */
async function execute( member, client ) {
	userLog(member, client)
}


/* ----------------------------------------------- */
/* MODULE EXPORTS                                  */
/* ----------------------------------------------- */
module.exports = {
	name: "guildMemberAdd",
	execute
}
