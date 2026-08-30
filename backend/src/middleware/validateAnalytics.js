const mongoose = require("mongoose");

/**
 * Validates the :projectId route param used by the events and
 * analytics endpoints. Ownership (does this project belong to the
 * authenticated company) is checked separately in the service layer.
 */
function validateAnalytics(req, res, next) {
  const { projectId } = req.params;

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "A valid projectId is required" });
  }

  next();
}

module.exports = validateAnalytics;
