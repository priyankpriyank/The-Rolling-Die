const openDatabase = require("../models/database");

async function seedDatabase() {

    const db = await openDatabase();

    // Check if games already exist
    const result = await db.get(
        "SELECT COUNT(*) AS total FROM games"
    );

    if (result.total > 0) {

        console.log("Database already contains games.");

        await db.close();

        return;
    }

    // Sample games
    const games = [
        {
            title: "Catan",
            category: "Strategy",
            price: 59.99,
            stock: 8,
            players: "3-4",
            description: "Build settlements and trade resources."
        },
        {
            title: "Wingspan",
            category: "Strategy",
            price: 64.99,
            stock: 5,
            players: "1-5",
            description: "Attract birds to your wildlife preserve."
        },
        {
            title: "Ticket to Ride",
            category: "Family",
            price: 54.99,
            stock: 10,
            players: "2-5",
            description: "Build railway routes across North America."
        },
        {
            title: "Pandemic",
            category: "Cooperative",
            price: 49.99,
            stock: 6,
            players: "2-4",
            description: "Work together to stop global diseases."
        },
        {
            title: "Azul",
            category: "Abstract",
            price: 39.99,
            stock: 4,
            players: "2-4",
            description: "Create beautiful tile patterns."
        },
        {
            title: "Carcassonne",
            category: "Strategy",
            price: 44.99,
            stock: 7,
            players: "2-5",
            description: "Build medieval cities and roads."
        },
        {
            title: "Exploding Kittens",
            category: "Party",
            price: 29.99,
            stock: 12,
            players: "2-5",
            description: "A fast-paced and hilarious card game."
        },
        {
            title: "Codenames",
            category: "Party",
            price: 24.99,
            stock: 9,
            players: "2-8",
            description: "Guess secret agents using word clues."
        }
    ];

    // Insert games
    for (const game of games) {

        await db.run(
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

    }

    console.log("Sample games added successfully!");

    await db.close();
}

// Run seed function
seedDatabase().catch(error => {
    console.error("Error seeding database:", error);
    process.exitCode = 1;
});