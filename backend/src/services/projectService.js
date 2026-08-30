const Project = require("../models/Project");

async function createProject(companyId, { projectName, platform }) {
  const project = await Project.create({
    companyId,
    projectName: projectName.trim(),
    platform: platform || "web",
  });

  return project;
}

async function getProjectsForCompany(companyId) {
  const projects = await Project.find({ companyId }).sort({ createdAt: -1 });
  return projects;
}

/**
 * Throws a 404 if the project doesn't exist, or a 403 if it exists but
 * belongs to a different company. Used by every downstream endpoint
 * that needs to prove ownership before touching events/analytics.
 */
async function getOwnedProjectOrThrow(companyId, projectId) {
  const project = await Project.findById(projectId);

  if (!project) {
    const err = new Error("Project not found");
    err.statusCode = 404;
    throw err;
  }

  if (project.companyId.toString() !== companyId.toString()) {
    const err = new Error("You do not have access to this project");
    err.statusCode = 403;
    throw err;
  }

  return project;
}

module.exports = { createProject, getProjectsForCompany, getOwnedProjectOrThrow };
