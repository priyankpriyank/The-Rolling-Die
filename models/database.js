const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
const path = require("path");

const databaseFile = path.join(__dirname, "../database/inventory.db");

async function openDatabase() {

    const db = await sqlite.open({
        filename: databaseFile,
        driver: sqlite3.Database
    });

    // Games table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL CHECK(price >= 0),
            stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
            players TEXT,
            description TEXT
        )
    `);

    // Managers table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS managers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `);

    return db;
}

module.exports = openDatabase;