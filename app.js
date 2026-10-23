const express = require("express");
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const path = require("path");
const { startBot } = require("./bot/bot");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

// Mustache
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Session configuration
if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be configured in .env");
}

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}));

// Routes
const gameRoutes = require("./routes/gameRoutes");
const authRoutes = require("./routes/authRoutes");
const managerRoutes = require("./routes/managerRoutes");

app.use("/", gameRoutes);
app.use("/", authRoutes);
app.use("/", managerRoutes);

// Homepage
app.get("/", (req, res) => {
    res.render("index", {
        title: "The Rolling Die",
        message: "Welcome to The Rolling Die Board Game Store!"
    });
});

// Start server
app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});

// Start Discord bot
startBot().catch(error => {
    console.error("Failed to start Discord bot:", error);
});