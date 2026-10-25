const openDatabase = require("./database");

// Get all games
async function getAllGames() {

    const db = await openDatabase();

    const games = await db.all(`
        SELECT *
        FROM games
        ORDER BY title ASC
    `);

    await db.close();

    return games;
}


// Get one game by ID
async function getGameById(id) {

    const db = await openDatabase();

    const game = await db.get(
        "SELECT * FROM games WHERE id = ?",
        [id]
    );

    await db.close();

    return game;
}


// Search games by title
async function searchGames(searchTerm) {

    const db = await openDatabase();

    const games = await db.all(
        "SELECT * FROM games WHERE title or category LIKE ? ORDER BY title ASC",
        [`%${searchTerm}%`]
    );

    await db.close();

    return games;
}


// Add a new game
async function addGame(game) {

    const db = await openDatabase();

    const result = await db.run(
        `INSERT INTO games
        (title, category, price, stock, players, description)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            game.title,
            game.category,
            game.price,
            game.stock,
            game.players,
            game.description
        ]
    );

    await db.close();

    return result;
}


// Update an existing game
async function updateGame(id, game) {

    const db = await openDatabase();

    const result = await db.run(
        `UPDATE games
        SET title = ?,
            category = ?,
            price = ?,
            stock = ?,
            players = ?,
            description = ?
        WHERE id = ?`,
        [
            game.title,
            game.category,
            game.price,
            game.stock,
            game.players,
            game.description,
            id
        ]
    );

    await db.close();

    return result;
}


// Delete a game
async function deleteGame(id) {

    const db = await openDatabase();

    const result = await db.run(
        "DELETE FROM games WHERE id = ?",
        [id]
    );

    await db.close();

    return result;
}


// Export model functions
module.exports = {
    getAllGames,
    getGameById,
    searchGames,
    addGame,
    updateGame,
    deleteGame
};