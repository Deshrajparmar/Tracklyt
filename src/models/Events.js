const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  userId: {
    type: String, 
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  page: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Event", eventSchema);
