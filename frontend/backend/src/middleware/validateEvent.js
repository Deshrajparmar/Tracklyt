const mongoose = require("mongoose");

function validateEvent(req, res, next) {
  const { projectId, userId, eventName } = req.body;

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: "A valid projectId is required" });
  }

  if (!userId || !String(userId).trim()) {
    return res.status(400).json({ message: "userId is required" });
  }

  if (!eventName || !String(eventName).trim()) {
    return res.status(400).json({ message: "eventName is required" });
  }

  next();
}

module.exports = validateEvent;
