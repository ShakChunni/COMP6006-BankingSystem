const express = require("express");

const adminController = require("../controllers/adminController");

const router = express.Router();

router.get("/", adminController.showAdminHome);
router.get("/users", adminController.listUsers);
router.post("/users/:userId/toggle-active", adminController.toggleUserActive);
router.get("/accounts", adminController.listAccounts);
router.post("/accounts/:accountId/toggle-status", adminController.toggleAccountStatus);
router.get("/transactions", adminController.listTransactions);

module.exports = router;
