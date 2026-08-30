const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    page: {
      type: String,
      trim: true,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound indexes for the analytics query patterns we actually run.
eventSchema.index({ projectId: 1, timestamp: -1 });
eventSchema.index({ projectId: 1, eventName: 1 });
eventSchema.index({ projectId: 1, userId: 1 });
eventSchema.index({ companyId: 1 });

module.exports = mongoose.model("Event", eventSchema);
