const test = require("node:test");
const assert = require("node:assert/strict");

const { formatValidationErrors } = require("../utils/validation");
const { generateUniqueAccountNumber } = require("../utils/accountNumber");
const Account = require("../models/Account");

test("formatValidationErrors returns clean messages without quotes", () => {
  const fakeError = {
    details: [{ message: "\"customerId\" is required" }, { message: "\"password\" is required" }],
  };
  assert.deepEqual(formatValidationErrors(fakeError), ["customerId is required", "password is required"]);
});

test("generateUniqueAccountNumber retries until number is unique", async () => {
  const originalExists = Account.exists;
  let calls = 0;

  Account.exists = async () => {
    calls += 1;
    return calls === 1;
  };

  try {
    const accountNumber = await generateUniqueAccountNumber();
    assert.match(accountNumber, /^\d{10}$/);
    assert.equal(calls, 2);
  } finally {
    Account.exists = originalExists;
  }
});
