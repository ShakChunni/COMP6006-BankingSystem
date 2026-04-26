const test = require("node:test");
const assert = require("node:assert/strict");

const { ensureAuthenticated, ensureGuest, ensureActiveUser, ensureAdmin } = require("../middleware/auth");

function createRes() {
  return {
    redirectedTo: null,
    redirect(path) {
      this.redirectedTo = path;
      return this;
    },
  };
}

test("ensureAuthenticated calls next for authenticated users", () => {
  let nextCalled = false;
  const req = {
    isAuthenticated: () => true,
    flash: () => {},
  };
  const res = createRes();

  ensureAuthenticated(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.redirectedTo, null);
});

test("ensureAuthenticated redirects guests to /login", () => {
  const flashes = [];
  const req = {
    isAuthenticated: () => false,
    flash: (type, message) => flashes.push({ type, message }),
  };
  const res = createRes();

  ensureAuthenticated(req, res, () => {});

  assert.equal(res.redirectedTo, "/login");
  assert.deepEqual(flashes[0], { type: "error", message: "Please log in first." });
});

test("ensureGuest redirects logged-in users to /dashboard", () => {
  const req = { isAuthenticated: () => true };
  const res = createRes();

  ensureGuest(req, res, () => {});
  assert.equal(res.redirectedTo, "/dashboard");
});

test("ensureAdmin redirects non-admin users to /dashboard", () => {
  const flashes = [];
  const req = {
    user: { isAdmin: false },
    flash: (type, message) => flashes.push({ type, message }),
  };
  const res = createRes();

  ensureAdmin(req, res, () => {});

  assert.equal(res.redirectedTo, "/dashboard");
  assert.deepEqual(flashes[0], { type: "error", message: "Admin access only." });
});

test("ensureActiveUser logs out inactive users and redirects to /login", async () => {
  const flashes = [];
  const req = {
    user: { isActive: false },
    flash: (type, message) => flashes.push({ type, message }),
    logout: (cb) => cb(),
  };
  const res = createRes();

  await new Promise((resolve) => {
    ensureActiveUser(req, res, () => resolve());
    setImmediate(resolve);
  });

  assert.equal(res.redirectedTo, "/login");
  assert.deepEqual(flashes[0], {
    type: "error",
    message: "Your account is inactive. Please contact admin.",
  });
});
