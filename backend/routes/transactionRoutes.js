const express = require("express");
const { getTransactions } = require("../controllers/Transaction");
const TransactionRouter = express.Router();

// ? get transactions or orders
TransactionRouter.get("/", getTransactions);

module.exports = TransactionRouter;