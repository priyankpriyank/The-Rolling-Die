const bcrypt = require("bcryptjs");
const openDatabase = require("../models/database");

// Show login page
function showLogin(req, res) {

    if (req.session.managerId) {
        return res.redirect("/manager/dashboard");
    }

    res.render("login", {
        title: "Manager Login"
    });
}

// Process login
async function login(req, res) {

    const { username, password } = req.body;

    let db;

    try {

        db = await openDatabase();

        const manager = await db.get(
            "SELECT * FROM managers WHERE username = ?",
            [username]
        );

        if (!manager) {
            return res.status(401).render("login", {
                title: "Manager Login",
                error: "Invalid username or password."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password || "",
            manager.password
        );

        if (!passwordMatches) {
            return res.status(401).render("login", {
                title: "Manager Login",
                error: "Invalid username or password."
            });
        }

        // Regenerate session after successful authentication
        req.session.regenerate(error => {

            if (error) {
                console.error("Session error:", error);
                return res.status(500).send("Login failed.");
            }

            req.session.managerId = manager.id;
            req.session.username = manager.username;

            req.session.save(error => {

                if (error) {
                    console.error("Session save error:", error);
                    return res.status(500).send("Login failed.");
                }

                res.redirect("/manager/dashboard");

            });

        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).send("An error occurred during login.");

    } finally {

        if (db) {
            await db.close();
        }

    }
}

// Logout
function logout(req, res) {

    req.session.destroy(error => {

        if (error) {
            console.error("Logout error:", error);
            return res.status(500).send("Unable to log out.");
        }

        res.clearCookie("connect.sid");

        res.redirect("/manager/login");

    });

}

module.exports = {
    showLogin,
    login,
    logout
};