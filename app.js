const express = require("express");
const mustacheExpress = require("mustache-express");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

// Configure Mustache
app.engine("mustache", mustacheExpress());

app.set("view engine", "mustache");

app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
    res.render("index", {
        title: "The Rolling Die",
        message: "Welcome to The Rolling Die Board Game Store!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`The Rolling Die server is running at http://localhost:${PORT}`);
});