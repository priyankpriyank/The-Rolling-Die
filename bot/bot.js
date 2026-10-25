const {
    Client,
    GatewayIntentBits,
    Events
} = require("discord.js");

const gameModel = require("../models/gameModel");

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// Socket.IO instance
let socketIO;

// Bot ready event
client.once(Events.ClientReady, readyClient => {

    console.log(`Discord bot logged in as ${readyClient.user.tag}`);

});

// Find game by title
async function findGame(title) {

    const games = await gameModel.searchGames(title);

    const exactMatch = games.find(game =>
        game.title.toLowerCase() === title.toLowerCase()
    );

    return exactMatch || games[0];

}

// Handle slash commands
client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isChatInputCommand()) {
        return;
    }

    const commandName = interaction.commandName;

    if (!["stock", "price", "game"].includes(commandName)) {
        return;
    }

    let title = "";
    let status = "Success";

    try {

        // for 
        await interaction.deferReply();

        title = interaction.options.getString(
            "title",
            true
        ).trim();

        // Query live database
        const game = await findGame(title);

        if (!game) {

            status = "Game Not Found";

            await interaction.editReply(
                `Sorry, we couldn't find "${title}" in our inventory.`
            );

            return;
        }

        // Stock command
        if (commandName === "stock") {

            if (game.stock > 0) {

                await interaction.editReply(
                    `**${game.title}**\n\n` +
                    `In Stock!\n` +
                    `Available copies: ${game.stock}`
                );

            } else {

                await interaction.editReply(
                    `**${game.title}**\n\n` +
                    `Currently out of stock.`
                );

            }

        }

        // Price command
        else if (commandName === "price") {

            await interaction.editReply(
                `**${game.title}**\n\n` +
                `Price: $${Number(game.price).toFixed(2)}`
            );

        }

        // Game details command
        else if (commandName === "game") {

            const stockMessage =
                game.stock > 0
                    ? `${game.stock} available`
                    : "Out of stock";

            await interaction.editReply(
                `**${game.title}**\n\n` +
                `Category: ${game.category}\n` +
                `Players: ${game.players || "Not specified"}\n` +
                `Price: $${Number(game.price).toFixed(2)}\n` +
                `Stock: ${stockMessage}\n\n` +
                `${game.description || "No description available."}`
            );

        }

    } catch (error) {

        status = "Error";

        console.error("Discord command error:", error);

        const errorMessage =
            "Sorry, something went wrong while checking our inventory.";

        try {

            if (interaction.deferred || interaction.replied) {

                await interaction.editReply(errorMessage);

            } else {

                await interaction.reply({
                    content: errorMessage,
                    ephemeral: true
                });

            }

        } catch (replyError) {

            console.error("Unable to send error response:", replyError);

        }

    } finally {

        // Send real-time activity to manager dashboard
        if (socketIO) {

            socketIO.to("managers").emit("botactivity", {
                command: commandName,
                title: title,
                status: status,
                time: new Date().toLocaleTimeString()
            });

        }

    }

});

// Start bot
async function startBot(io) {

    socketIO = io;

    if (!process.env.DISCORD_TOKEN) {

        console.log("Discord token not configured.");

        return;
    }

    await client.login(process.env.DISCORD_TOKEN);

}

module.exports = {
    startBot,
    client
};