const express = require("express");

const authController = require("../controllers/authController");
const { ensureGuest, ensureAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("/", authController.showHome);
router.get("/register", ensureGuest, authController.showRegister);
router.post("/register", ensureGuest, authController.register);
router.get("/login", ensureGuest, authController.showLogin);
router.post("/login", ensureGuest, authController.login);
router.post("/logout", ensureAuthenticated, authController.logout);

module.exports = router;
