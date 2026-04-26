const Account = require("../models/Account");

async function ensureAccountOwner(req, res, next) {
  try {
    const account = await Account.findById(req.params.accountId);
    if (!account) {
      req.flash("error", "Account not found.");
      return res.redirect("/dashboard");
    }

    if (!req.user._id.equals(account.createdBy)) {
      req.flash("error", "You can only access your own account.");
      return res.redirect("/dashboard");
    }

    req.account = account;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { ensureAccountOwner };
