function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  next();
}

module.exports = validateLogin;
