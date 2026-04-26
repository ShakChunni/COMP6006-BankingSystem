const test = require("node:test");
const assert = require("node:assert/strict");

const {
  registerSchema,
  loginSchema,
  accountSchema,
  transactionSchema,
  transferSchema,
} = require("../validations/schemas");

test("register schema accepts valid input", () => {
  const result = registerSchema.validate({
    customerId: "student001",
    password: "password123",
    address: "Sydney",
    phone: "0400000000",
  });
  assert.equal(result.error, undefined);
});

test("register schema rejects password shorter than 8 chars", () => {
  const result = registerSchema.validate({
    customerId: "student001",
    password: "short",
  });
  assert.ok(result.error);
});

test("login schema requires customerId and password", () => {
  const result = loginSchema.validate({ customerId: "" });
  assert.ok(result.error);
});

test("account schema requires account type", () => {
  const result = accountSchema.validate({ initialBalance: 10 });
  assert.ok(result.error);
});

test("transaction schema requires positive amount and valid type", () => {
  const invalidAmount = transactionSchema.validate({ type: "credit", amount: 0 });
  const invalidType = transactionSchema.validate({ type: "transfer", amount: 100 });

  assert.ok(invalidAmount.error);
  assert.ok(invalidType.error);
});

test("transfer schema requires transfer type and positive amount", () => {
  const valid = transferSchema.validate({ type: "transfer", toAccountId: "abc", amount: 50 });
  const invalid = transferSchema.validate({ toAccountId: "abc", amount: -1 });

  assert.equal(valid.error, undefined);
  assert.ok(invalid.error);
});
