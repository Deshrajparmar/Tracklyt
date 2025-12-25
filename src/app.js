require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/database");

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




app.listen(7000, () => {
  console.log("Server is running on port 7000");
});

module.exports = app;
