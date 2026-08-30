const jwt = require("jsonwebtoken");

/**
 * Verifies the Authorization: Bearer <token> header and attaches
 * req.user = { companyId, email } for downstream handlers.
 *
 * Protected routes must always use req.user.companyId for ownership
 * checks - never a companyId supplied by the client.
 */
function authGuard(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      companyId: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please log in again" });
    }
    return res.status(401).json({ message: "Invalid authentication token" });
  }
}

module.exports = authGuard;
