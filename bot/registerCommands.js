require("dotenv").config();

const {
    REST,
    Routes,
    SlashCommandBuilder
} = require("discord.js");

// Define slash commands
const commands = [

    // Stock command
    new SlashCommandBuilder()
        .setName("stock")
        .setDescription("Check if a board game is in stock")
        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("Name of the board game")
                .setRequired(true)
        ),

    // Price command
    new SlashCommandBuilder()
        .setName("price")
        .setDescription("Check the price of a board game")
        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("Name of the board game")
                .setRequired(true)
        ),

    // Game details command
    new SlashCommandBuilder()
        .setName("game")
        .setDescription("Get detailed information about a board game")
        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("Name of the board game")
                .setRequired(true)
        )

].map(command => command.toJSON());

// Discord REST API
const rest = new REST({
    version: "10"
}).setToken(process.env.DISCORD_TOKEN);

// Register commands
async function registerCommands() {

    try {

        console.log("Registering Discord slash commands...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.DISCORD_CLIENT_ID,
                process.env.DISCORD_GUILD_ID
            ),
            {
                body: commands
            }
        );

        console.log("Discord slash commands registered successfully!");

    } catch (error) {

        console.error("Error registering commands:", error);

    }

}

registerCommands();