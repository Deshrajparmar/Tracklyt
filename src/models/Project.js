const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ["web", "mobile"],
    default: "web"
  }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
