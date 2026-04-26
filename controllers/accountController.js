const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const { accountSchema, transactionSchema, transferSchema } = require("../validations/schemas");
const { formatValidationErrors } = require("../utils/validation");
const { generateUniqueAccountNumber } = require("../utils/accountNumber");

async function loadAccountPageData(userId, accountId) {
  const otherAccounts = await Account.find({
    createdBy: userId,
    _id: { $ne: accountId },
  }).sort({ createdAt: -1 });

  const transactions = await Transaction.find({
    createdBy: userId,
    $or: [{ account: accountId }, { fromAccount: accountId }, { toAccount: accountId }],
  })
    .populate("account fromAccount toAccount")
    .sort({ createdAt: -1 });

  return { otherAccounts, transactions };
}

async function renderAccountDetail(req, res, extras = {}) {
  const { otherAccounts, transactions } = await loadAccountPageData(req.user._id, req.account._id);
  return res.render("accounts/show", {
    account: req.account,
    otherAccounts,
    transactions,
    isOwner: true,
    transactionData: extras.transactionData || {},
    transferData: extras.transferData || {},
    validationErrors: extras.validationErrors || [],
  });
}

function showCreateForm(req, res) {
  return res.render("accounts/new", { formData: {} });
}

async function createAccount(req, res, next) {
  try {
    const { error, value } = accountSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).render("accounts/new", {
        validationErrors: formatValidationErrors(error),
        formData: req.body,
      });
    }

    const accountNumber = await generateUniqueAccountNumber();
    await Account.create({
      accountNumber,
      accountType: value.accountType,
      balance: value.initialBalance || 0,
      createdBy: req.user._id,
    });

    req.flash("success", "Bank account created.");
    return res.redirect("/dashboard");
  } catch (error) {
    return next(error);
  }
}

async function showAccount(req, res, next) {
  try {
    return await renderAccountDetail(req, res);
  } catch (error) {
    return next(error);
  }
}

async function toggleAccountStatus(req, res, next) {
  try {
    req.account.status = req.account.status === "Active" ? "Inactive" : "Active";
    await req.account.save();
    req.flash("success", `Account status changed to ${req.account.status}.`);
    return res.redirect(`/accounts/${req.account._id}`);
  } catch (error) {
    return next(error);
  }
}

async function createTransaction(req, res, next) {
  try {
    const { error, value } = transactionSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).render("accounts/show", {
        account: req.account,
        ...(await loadAccountPageData(req.user._id, req.account._id)),
        isOwner: true,
        transactionData: req.body,
        transferData: {},
        validationErrors: formatValidationErrors(error),
      });
    }

    if (req.account.status !== "Active") {
      return res.status(400).render("accounts/show", {
        account: req.account,
        ...(await loadAccountPageData(req.user._id, req.account._id)),
        isOwner: true,
        transactionData: req.body,
        transferData: {},
        validationErrors: ["Only active accounts can perform transactions."],
      });
    }

    const amount = Number(value.amount);
    if (value.type === "debit" && req.account.balance < amount) {
      return res.status(400).render("accounts/show", {
        account: req.account,
        ...(await loadAccountPageData(req.user._id, req.account._id)),
        isOwner: true,
        transactionData: req.body,
        transferData: {},
        validationErrors: ["Insufficient balance for debit transaction."],
      });
    }

    req.account.balance = value.type === "credit" ? req.account.balance + amount : req.account.balance - amount;
    await req.account.save();

    await Transaction.create({
      type: value.type,
      amount,
      description: value.description || "",
      reference: value.reference || "",
      account: req.account._id,
      createdBy: req.user._id,
    });

    req.flash("success", "Transaction completed.");
    return res.redirect(`/accounts/${req.account._id}`);
  } catch (error) {
    return next(error);
  }
}

async function transferFunds(req, res, next) {
  try {
    const { error, value } = transferSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).render("accounts/show", {
        account: req.account,
        ...(await loadAccountPageData(req.user._id, req.account._id)),
        isOwner: true,
        transactionData: {},
        transferData: req.body,
        validationErrors: formatValidationErrors(error),
      });
    }

    if (req.account.status !== "Active") {
      return res.status(400).render("accounts/show", {
        account: req.account,
        ...(await loadAccountPageData(req.user._id, req.account._id)),
        isOwner: true,
        transactionData: {},
        transferData: req.body,
        validationErrors: ["Only active accounts can transfer funds."],
      });
    }

    const destinationAccount = await Account.findOne({
      _id: value.toAccountId,
      createdBy: req.user._id,
    });

    if (!destinationAccount) {
      return res.status(400).render("accounts/show", {
        account: req.account,
        ...(await loadAccountPageData(req.user._id, req.account._id)),
        isOwner: true,
        transactionData: {},
        transferData: req.body,
        validationErrors: ["Destination account does not belong to you."],
      });
    }

    if (destinationAccount._id.equals(req.account._id)) {
      return res.status(400).render("accounts/show", {
        account: req.account,
        ...(await loadAccountPageData(req.user._id, req.account._id)),
        isOwner: true,
        transactionData: {},
        transferData: req.body,
        validationErrors: ["Source and destination accounts must be different."],
      });
    }

    if (destinationAccount.status !== "Active") {
      return res.status(400).render("accounts/show", {
        account: req.account,
        ...(await loadAccountPageData(req.user._id, req.account._id)),
        isOwner: true,
        transactionData: {},
        transferData: req.body,
        validationErrors: ["Destination account must be active."],
      });
    }

    const amount = Number(value.amount);
    if (req.account.balance < amount) {
      return res.status(400).render("accounts/show", {
        account: req.account,
        ...(await loadAccountPageData(req.user._id, req.account._id)),
        isOwner: true,
        transactionData: {},
        transferData: req.body,
        validationErrors: ["Insufficient balance for transfer."],
      });
    }

    req.account.balance -= amount;
    destinationAccount.balance += amount;

    await Promise.all([req.account.save(), destinationAccount.save()]);

    await Transaction.create({
      type: "transfer",
      amount,
      description: value.description || "",
      reference: value.reference || "",
      fromAccount: req.account._id,
      toAccount: destinationAccount._id,
      createdBy: req.user._id,
    });

    req.flash("success", "Transfer completed.");
    return res.redirect(`/accounts/${req.account._id}`);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  showCreateForm,
  createAccount,
  showAccount,
  toggleAccountStatus,
  createTransaction,
  transferFunds,
};
