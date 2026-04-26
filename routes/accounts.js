const express = require("express");

const accountController = require("../controllers/accountController");
const { ensureAccountOwner } = require("../middleware/ownership");

const router = express.Router();

router.get("/new", accountController.showCreateForm);
router.post("/", accountController.createAccount);
router.get("/:accountId", ensureAccountOwner, accountController.showAccount);
router.post("/:accountId/toggle-status", ensureAccountOwner, accountController.toggleAccountStatus);
router.post("/:accountId/transactions", ensureAccountOwner, accountController.createTransaction);
router.post("/:accountId/transfer", ensureAccountOwner, accountController.transferFunds);

module.exports = router;
