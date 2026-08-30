const express = require("express");
const authGuard = require("../controllers/authGuard");
const validateProject = require("../middleware/validateProject");
const projectService = require("../services/projectService");

const router = express.Router();

router.post("/", authGuard, validateProject, async (req, res, next) => {
  try {
    const { projectName, platform } = req.body;
    const project = await projectService.createProject(req.user.companyId, {
      projectName,
      platform,
    });
    res.status(201).json({ message: "Project created successfully", project });
  } catch (err) {
    next(err);
  }
});

router.get("/", authGuard, async (req, res, next) => {
  try {
    const projects = await projectService.getProjectsForCompany(req.user.companyId);
    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
