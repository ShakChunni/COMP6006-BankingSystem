require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const configurePassport = require("./config/passport");
const { ensureAuthenticated, ensureActiveUser, ensureAdmin } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const accountRoutes = require("./routes/accounts");
const transactionRoutes = require("./routes/transactions");
const profileRoutes = require("./routes/profile");
const adminRoutes = require("./routes/admin");

const app = express();

configurePassport();

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.locals.formatCurrency = (amount) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(amount || 0);

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/accounts", ensureAuthenticated, ensureActiveUser, accountRoutes);
app.use("/transactions", ensureAuthenticated, ensureActiveUser, transactionRoutes);
app.use("/profile", ensureAuthenticated, ensureActiveUser, profileRoutes);
app.use("/admin", ensureAuthenticated, ensureActiveUser, ensureAdmin, adminRoutes);

app.use((req, res) => {
  res.status(404).render("index", {
    validationErrors: ["Page not found."],
  });
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/online_banking_assignment";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });
