const express = require("express");
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const path = require("path");
const http = require("http");

require("dotenv").config();

// Create Express application
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const { Server } = require("socket.io");

const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Configure Mustache
app.engine("mustache", mustacheExpress());

app.set("view engine", "mustache");

app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Session configuration
if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be configured.");
}

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
});

app.use(sessionMiddleware);

// Share Express sessions with Socket.IO
io.engine.use(sessionMiddleware);

// Authenticate websocket connections
io.use((socket, next) => {

    const session = socket.request.session;

    if (!session || !session.managerId) {
        return next(new Error("Unauthorized"));
    }

    next();

});

// Websocket connection
io.on("connection", socket => {

    console.log("Manager connected to live dashboard");

    socket.join("managers");

    socket.on("disconnect", () => {

        console.log("Manager disconnected from live dashboard");

    });

});

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

// Import Discord bot
const { startBot } = require("./bot/bot");

// Start web server
server.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});

// Start Discord bot and pass Socket.IO instance
startBot(io).catch(error => {

    console.error("Failed to start Discord bot:", error);

});