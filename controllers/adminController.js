const User = require("../models/User");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

async function showAdminHome(req, res, next) {
  try {
    const [userCount, accountCount, transactionCount] = await Promise.all([
      User.countDocuments(),
      Account.countDocuments(),
      Transaction.countDocuments(),
    ]);

    return res.render("admin/index", {
      summary: { userCount, accountCount, transactionCount },
    });
  } catch (error) {
    return next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.render("admin/users", { users });
  } catch (error) {
    return next(error);
  }
}

async function toggleUserActive(req, res, next) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/admin/users");
    }

    user.isActive = !user.isActive;
    await user.save();

    req.flash("success", `User ${user.customerId} is now ${user.isActive ? "Active" : "Inactive"}.`);
    return res.redirect("/admin/users");
  } catch (error) {
    return next(error);
  }
}

async function listAccounts(req, res, next) {
  try {
    const accounts = await Account.find().populate("createdBy").sort({ createdAt: -1 });
    return res.render("admin/accounts", { accounts });
  } catch (error) {
    return next(error);
  }
}

async function toggleAccountStatus(req, res, next) {
  try {
    const account = await Account.findById(req.params.accountId);
    if (!account) {
      req.flash("error", "Account not found.");
      return res.redirect("/admin/accounts");
    }

    account.status = account.status === "Active" ? "Inactive" : "Active";
    await account.save();

    req.flash("success", `Account ${account.accountNumber} is now ${account.status}.`);
    return res.redirect("/admin/accounts");
  } catch (error) {
    return next(error);
  }
}

async function listTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find()
      .populate("createdBy account fromAccount toAccount")
      .sort({ createdAt: -1 });

    return res.render("admin/transactions", { transactions });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  showAdminHome,
  listUsers,
  toggleUserActive,
  listAccounts,
  toggleAccountStatus,
  listTransactions,
};
