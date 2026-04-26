const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

async function searchTransactions(req, res, next) {
  try {
    const { search = "", accountNumber = "", startDate = "", endDate = "", amount = "" } = req.query;

    const ownedAccounts = await Account.find({ createdBy: req.user._id }).select("_id accountNumber accountType");

    let accountIds = ownedAccounts.map((account) => account._id);
    if (accountNumber.trim()) {
      const accountRegex = new RegExp(accountNumber.trim(), "i");
      accountIds = ownedAccounts.filter((account) => accountRegex.test(account.accountNumber)).map((account) => account._id);
    }

    const filters = [];
    filters.push({
      $or: [{ account: { $in: accountIds } }, { fromAccount: { $in: accountIds } }, { toAccount: { $in: accountIds } }],
    });

    if (search.trim()) {
      const textRegex = new RegExp(search.trim(), "i");
      filters.push({
        $or: [{ description: { $regex: textRegex } }, { reference: { $regex: textRegex } }],
      });
    }

    if (amount !== "") {
      const numericAmount = Number(amount);
      if (!Number.isNaN(numericAmount) && numericAmount > 0) {
        filters.push({ amount: numericAmount });
      }
    }

    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!Number.isNaN(start.getTime())) {
          dateFilter.$gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!Number.isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          dateFilter.$lte = end;
        }
      }
      if (Object.keys(dateFilter).length > 0) {
        filters.push({ createdAt: dateFilter });
      }
    }

    const query = { createdBy: req.user._id };
    if (filters.length > 0) {
      query.$and = filters;
    }

    const transactions = await Transaction.find(query)
      .populate("account fromAccount toAccount")
      .sort({ createdAt: -1 });

    return res.render("transactions/index", {
      transactions,
      filters: { search, accountNumber, startDate, endDate, amount },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { searchTransactions };
