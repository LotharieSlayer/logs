const { data } = require("../../../commands/setup/setup");
const { setupLogs } = require("../../../utils/enmapUtils");

const slashCommand = data.addSubcommand((subcommand) =>
subcommand
    .setName("logs")
    .setDescription(
        "Définir/Supprimer le channel pour les logs. (Il ne peut n'y en avoir qu'un)"
    )
)

/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */
/**
 * Fonction appelé quand la commande est 'setup'
 * @param {CommandInteraction} interaction L'interaction généré par l'exécution de la commande.
 */
async function execute(interaction) {
    if (setupLogs.get(interaction.guild.id) === undefined) {
        setupLogs.set(interaction.guild.id, interaction.channel.id);
        await interaction.reply({
            content: `Logs ajouté au serveur dans <#${interaction.channel.id}> !`,
            ephemeral: true,
        });
    } else {
        setupLogs.delete(interaction.guild.id);
        await interaction.reply({
            content: `Logs supprimé du serveur !`,
            ephemeral: true,
        });
    }
}

module.exports = {
    data: slashCommand,
    execute,
};
