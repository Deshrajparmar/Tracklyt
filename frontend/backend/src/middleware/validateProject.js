const ALLOWED_PLATFORMS = ["web", "android", "ios"];

function validateProject(req, res, next) {
  const { projectName, platform } = req.body;

  if (!projectName || !projectName.trim()) {
    return res.status(400).json({ message: "Project name is required" });
  }

  if (platform && !ALLOWED_PLATFORMS.includes(platform)) {
    return res.status(400).json({ message: "Platform must be one of: web, android, ios" });
  }

  next();
}

module.exports = validateProject;
