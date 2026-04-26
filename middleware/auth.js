function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please log in first.");
  return res.redirect("/login");
}

function ensureGuest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/dashboard");
}

function ensureActiveUser(req, res, next) {
  if (!req.user || req.user.isActive) {
    return next();
  }

  return req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.flash("error", "Your account is inactive. Please contact admin.");
    return res.redirect("/login");
  });
}

function ensureAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  req.flash("error", "Admin access only.");
  return res.redirect("/dashboard");
}

module.exports = {
  ensureAuthenticated,
  ensureGuest,
  ensureActiveUser,
  ensureAdmin,
};
