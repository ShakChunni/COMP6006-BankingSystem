const Account = require("../models/Account");

async function showDashboard(req, res, next) {
  try {
    const accounts = await Account.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    return res.render("dashboard", { accounts });
  } catch (error) {
    return next(error);
  }
}

module.exports = { showDashboard };
