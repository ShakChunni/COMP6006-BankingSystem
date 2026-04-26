const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../models/User");
const { registerSchema, loginSchema } = require("../validations/schemas");
const { formatValidationErrors } = require("../utils/validation");

function showHome(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  return res.render("index");
}

function showRegister(req, res) {
  return res.render("auth/register", { formData: {} });
}

async function register(req, res, next) {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).render("auth/register", {
        validationErrors: formatValidationErrors(error),
        formData: req.body,
      });
    }

    const existingUser = await User.findOne({ customerId: value.customerId });
    if (existingUser) {
      return res.status(400).render("auth/register", {
        validationErrors: ["Customer ID already exists. Please choose another one."],
        formData: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);

    await User.create({
      customerId: value.customerId,
      password: hashedPassword,
      address: value.address || "",
      phone: value.phone || "",
    });

    req.flash("success", "Registration successful. You can now log in.");
    return res.redirect("/login");
  } catch (error) {
    return next(error);
  }
}

function showLogin(req, res) {
  return res.render("auth/login", { formData: {} });
}

function login(req, res, next) {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).render("auth/login", {
      validationErrors: formatValidationErrors(error),
      formData: req.body,
    });
  }

  return passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
}

function logout(req, res, next) {
  return req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.flash("success", "You have logged out successfully.");
    return res.redirect("/login");
  });
}

module.exports = {
  showHome,
  showRegister,
  register,
  showLogin,
  login,
  logout,
};
