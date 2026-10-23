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

// Bot ready event
client.once(Events.ClientReady, readyClient => {

    console.log(`Discord bot logged in as ${readyClient.user.tag}`);

});

// Find game by title
async function findGame(title) {

    const games = await gameModel.searchGames(title);

    // Prefer an exact match
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

    try {

        const title = interaction.options.getString(
            "title",
            true
        ).trim();

        // Search live SQLite data
        const game = await findGame(title);

        // Game not found
        if (!game) {

            await interaction.reply(
                `❌ Sorry, we couldn't find "${title}" in our inventory.`
            );

            return;
        }

        // Stock command
        if (commandName === "stock") {

            if (game.stock > 0) {

                await interaction.reply(
                    `🎲 **${game.title}**\n\n` +
                    `✅ **In Stock!**\n` +
                    `Available copies: ${game.stock}`
                );

            } else {

                await interaction.reply(
                    `🎲 **${game.title}**\n\n` +
                    `❌ Currently out of stock.`
                );

            }

        }

        // Price command
        else if (commandName === "price") {

            await interaction.reply(
                `🎲 **${game.title}**\n\n` +
                `💰 Price: **$${Number(game.price).toFixed(2)}**`
            );

        }

        // Game information command
        else if (commandName === "game") {

            const stockMessage =
                game.stock > 0
                    ? `${game.stock} available`
                    : "Out of stock";

            await interaction.reply(
                `🎲 **${game.title}**\n\n` +
                `📚 Category: ${game.category}\n` +
                `👥 Players: ${game.players || "Not specified"}\n` +
                `💰 Price: $${Number(game.price).toFixed(2)}\n` +
                `📦 Stock: ${stockMessage}\n\n` +
                `📝 ${game.description || "No description available."}`
            );

        }

    } catch (error) {

        console.error("Discord command error:", error);

        const errorMessage =
            "Sorry, something went wrong while checking our inventory.";

        if (interaction.replied || interaction.deferred) {

            await interaction.followUp({
                content: errorMessage,
                ephemeral: true
            });

        } else {

            await interaction.reply({
                content: errorMessage,
                ephemeral: true
            });

        }

    }

});

// Start Discord bot
async function startBot() {

    if (!process.env.DISCORD_TOKEN) {
        console.log("Discord token not configured. Bot not started.");
        return;
    }

    await client.login(process.env.DISCORD_TOKEN);

}

module.exports = {
    startBot,
    client
};