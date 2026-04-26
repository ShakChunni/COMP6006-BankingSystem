const express = require("express");

const profileController = require("../controllers/profileController");

const router = express.Router();

router.get("/", profileController.showProfile);
router.post("/", profileController.updateProfile);

module.exports = router;
