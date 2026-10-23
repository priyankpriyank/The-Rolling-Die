const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.get("/manager/login", authController.showLogin);

router.post("/manager/login", authController.login);

router.post("/manager/logout", authController.logout);

module.exports = router;