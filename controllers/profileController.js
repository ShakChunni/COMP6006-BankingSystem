const User = require("../models/User");
const { profileSchema } = require("../validations/schemas");
const { formatValidationErrors } = require("../utils/validation");

function showProfile(req, res) {
  return res.render("profile", {
    formData: {
      address: req.user.address || "",
      phone: req.user.phone || "",
    },
  });
}

async function updateProfile(req, res, next) {
  try {
    const { error, value } = profileSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).render("profile", {
        validationErrors: formatValidationErrors(error),
        formData: req.body,
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      address: value.address || "",
      phone: value.phone || "",
    });

    req.flash("success", "Personal details updated.");
    return res.redirect("/profile");
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  showProfile,
  updateProfile,
};
