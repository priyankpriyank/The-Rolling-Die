const gameModel = require("../models/gameModel");

// Format games for display
function formatGames(games) {

    return games.map(game => ({
        ...game,
        formattedPrice: Number(game.price).toFixed(2)
    }));

}

// Validate game information
function validateGame(body) {

    const title = String(body.title || "").trim();
    const category = String(body.category || "").trim();
    const players = String(body.players || "").trim();
    const description = String(body.description || "").trim();

    const priceInput = String(body.price ?? "").trim();
    const stockInput = String(body.stock ?? "").trim();

    const price = Number(priceInput);
    const stock = Number(stockInput);

    if (!title || !category) {
        return { error: "Title and category are required." };
    }

    if (
        priceInput === "" ||
        !Number.isFinite(price) ||
        price < 0
    ) {
        return { error: "Enter a valid non-negative price." };
    }

    if (
        stockInput === "" ||
        !Number.isSafeInteger(stock) ||
        stock < 0
    ) {
        return { error: "Stock must be a non-negative whole number." };
    }

    return {
        game: {
            title,
            category,
            price,
            stock,
            players,
            description
        }
    };

}

// Dashboard
async function showDashboard(req, res) {

    try {

        const games = await gameModel.getAllGames();

        res.render("dashboard", {
            title: "Manager Dashboard",
            username: req.session.username,
            games: formatGames(games),
            hasGames: games.length > 0
        });

    } catch (error) {

        console.error("Dashboard error:", error);

        res.status(500).send("Unable to load dashboard.");

    }

}

// Add game form
function showAddGame(req, res) {

    res.render("addGame", {
        title: "Add New Game"
    });

}

// Add game
async function addGame(req, res) {

    const validation = validateGame(req.body);

    if (validation.error) {
        return res.status(400).render("addGame", {
            title: "Add New Game",
            error: validation.error,
            game: req.body
        });
    }

    try {

        await gameModel.addGame(validation.game);

        res.redirect("/manager/dashboard");

    } catch (error) {

        console.error("Add game error:", error);

        res.status(500).send("Unable to add game.");

    }

}

// Edit game form
async function showEditGame(req, res) {

    try {

        const game = await gameModel.getGameById(req.params.id);

        if (!game) {
            return res.status(404).send("Game not found.");
        }

        res.render("editGame", {
            title: "Edit Game",
            game
        });

    } catch (error) {

        console.error("Edit form error:", error);

        res.status(500).send("Unable to load game.");

    }

}

// Update game
async function updateGame(req, res) {

    const validation = validateGame(req.body);

    if (validation.error) {
        return res.status(400).render("editGame", {
            title: "Edit Game",
            error: validation.error,
            game: {
                ...req.body,
                id: req.params.id
            }
        });
    }

    try {

        const result = await gameModel.updateGame(
            req.params.id,
            validation.game
        );

        if (result.changes === 0) {
            return res.status(404).send("Game not found.");
        }

        res.redirect("/manager/dashboard");

    } catch (error) {

        console.error("Update game error:", error);

        res.status(500).send("Unable to update game.");

    }

}

// Delete game
async function deleteGame(req, res) {

    try {

        await gameModel.deleteGame(req.params.id);

        res.redirect("/manager/dashboard");

    } catch (error) {

        console.error("Delete game error:", error);

        res.status(500).send("Unable to delete game.");

    }

}

module.exports = {
    showDashboard,
    showAddGame,
    addGame,
    showEditGame,
    updateGame,
    deleteGame
};