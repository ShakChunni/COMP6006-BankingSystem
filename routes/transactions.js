const express = require("express");

const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.get("/", transactionController.searchTransactions);

module.exports = router;
