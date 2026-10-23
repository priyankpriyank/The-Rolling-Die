const bcrypt = require("bcryptjs");
const openDatabase = require("../models/database");

async function createManager() {

    const db = await openDatabase();

    try {

        const username = process.env.MANAGER_USERNAME;
        const password = process.env.MANAGER_PASSWORD;

        if (!username || !password) {
            throw new Error(
                "Set MANAGER_USERNAME and MANAGER_PASSWORD in your environment."
            );
        }

        if (password.length < 12) {
            throw new Error(
                "Manager password must be at least 12 characters."
            );
        }

        // Check whether manager already exists
        const existingManager = await db.get(
            "SELECT * FROM managers WHERE username = ?",
            [username]
        );

        if (existingManager) {

            console.log("Manager account already exists.");

            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Store manager
        await db.run(
            "INSERT INTO managers (username, password) VALUES (?, ?)",
            [username, hashedPassword]
        );

        console.log("Manager account created successfully!");

    } finally {

        await db.close();

    }
}

require("dotenv").config();

createManager().catch(error => {
    console.error("Error creating manager:", error);
    process.exitCode = 1;
});