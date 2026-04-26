const express = require("express");

const dashboardController = require("../controllers/dashboardController");
const { ensureAuthenticated, ensureActiveUser } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", ensureAuthenticated, ensureActiveUser, dashboardController.showDashboard);

module.exports = router;
