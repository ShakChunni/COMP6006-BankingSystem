const Account = require("../models/Account");

async function generateUniqueAccountNumber() {
  let accountNumber = "";
  let exists = true;

  while (exists) {
    accountNumber = String(Math.floor(1000000000 + Math.random() * 9000000000));
    exists = await Account.exists({ accountNumber });
  }

  return accountNumber;
}

module.exports = { generateUniqueAccountNumber };
