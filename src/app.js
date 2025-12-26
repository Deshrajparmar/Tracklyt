require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/database");
const mongoose = require("mongoose");

const Company = require("./models/Company");
const Project = require("./models/Project");
const Event = require("./models/Events");

const app = express();
app.use(cors());
app.use(express.json());


app.post("/signup", async (req, res) => {
  try {
    const { companyName, email, password } = req.body;

    if (!companyName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const company = new Company({
      companyName,
      email,
      password, 
    });

    await company.save();

    res.status(201).json({
      message: "Company registered successfully",
      companyId: company._id,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error registering company",
      error: err.message,
    });
  }
});


app.post("/projects", async (req, res) => {
  try {
    const { companyId, projectName, platform } = req.body;

    if (!companyId || !projectName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const project = new Project({
      companyId,
      projectName,
      platform: platform || "web",
    });

    await project.save();

    res.status(201).json({
      message: "Project created successfully",
      projectId: project._id,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error creating project",
      error: err.message,
    });
  }
});

app.post("/events", async (req, res) => {
  try {
    const { companyId, projectId, userId, eventName, page } = req.body;

    if (!companyId || !projectId || !userId || !eventName) {
      return res.status(400).json({
        message: "Missing required event fields"
      });
    }

    const event = new Event({
      companyId,
      projectId,
      userId,
      eventName,
      page
    });

    await event.save();

    res.status(201).json({
      message: "Event tracked successfully"
    });
  } catch (err) {
    res.status(400).json({
      message: "Error tracking event",
      error: err.message
    });
  }
});

app.get("/analytics/summary/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const clearnProjectId = projectId.trim();

    const totalEvents = await Event.countDocuments({ projectId:clearnProjectId });

    const uniqueUsers = await Event.distinct("userId", { projectId });
    const uniqueUsersCount = uniqueUsers.length;

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const activeUsers = await Event.distinct("userId", {
      projectId,
      timestamp: { $gte: last24Hours }
    });
    const activeUsersCount = activeUsers.length;

    res.json({
      totalEvents,
      uniqueUsers: uniqueUsersCount,
      activeUsers: activeUsersCount
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch analytics summary",
      error: err.message
    });
  }
});


app.get("/events/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId.trim();

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const events = await Event.find({ projectId })
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(events);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch events",
      error: err.message
    });
  }
});


app.get("/analytics/events/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId.trim();

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const breakdown = await Event.aggregate([
      { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
      {
        $group: {
          _id: "$eventName",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {};
    breakdown.forEach(item => {
      result[item._id] = item.count;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch event breakdown",
      error: err.message
    });
  }
});


app.get("/analytics/funnel/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId.trim();

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const funnelSteps = ["signup", "signup", "dashboard"];
    const funnelResult = {};

    for (const step of funnelSteps) {
      const users = await Event.distinct("userId", {
        projectId,
        eventName: step
      });

      funnelResult[step] = users.length;
    }

    res.json(funnelResult);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch funnel analytics",
      error: err.message
    });
  }
});














app.listen(7000, () => {
  console.log("Server is running on port 7000");
});

module.exports = app;
