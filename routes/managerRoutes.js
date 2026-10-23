const express = require("express");
const router = express.Router();

const managerController = require("../controllers/managerController");
const requireLogin = require("../middleware/requireLogin");

// Protect all routes in this router
router.use("/manager", requireLogin);

// Dashboard
router.get(
    "/manager/dashboard",
    managerController.showDashboard
);

// Add game
router.get(
    "/manager/add",
    managerController.showAddGame
);

router.post(
    "/manager/add",
    managerController.addGame
);

// Edit game
router.get(
    "/manager/edit/:id",
    managerController.showEditGame
);

router.post(
    "/manager/edit/:id",
    managerController.updateGame
);

// Delete game
router.post(
    "/manager/delete/:id",
    managerController.deleteGame
);

module.exports = router;