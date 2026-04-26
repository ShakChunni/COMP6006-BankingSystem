function formatValidationErrors(error) {
  if (!error || !error.details) {
    return [];
  }
  return error.details.map((detail) => detail.message.replace(/"/g, ""));
}

module.exports = { formatValidationErrors };
