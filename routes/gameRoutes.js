const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

// Public inventory route
router.get("/inventory", gameController.showInventory);

module.exports = router;