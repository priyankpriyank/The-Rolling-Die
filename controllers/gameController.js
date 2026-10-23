const gameModel = require("../models/gameModel");

async function showInventory(req, res) {
    try {
        const searchTerm = (req.query.search || "").trim();

        let games;

        if (searchTerm) {
            games = await gameModel.searchGames(searchTerm);
        } else {
            games = await gameModel.getAllGames();
        }

        const formattedGames = games.map(game => ({
            ...game,
            formattedPrice: Number(game.price).toFixed(2),
            inStock: game.stock > 0,
            outOfStock: game.stock === 0
        }));

        res.render("inventory", {
            title: "Game Inventory - The Rolling Die",
            games: formattedGames,
            searchTerm,
            hasGames: formattedGames.length > 0
        });

    } catch (error) {
        console.error("Error loading inventory:", error);
        res.status(500).send("Unable to load inventory.");
    }
}

module.exports = {
    showInventory
};