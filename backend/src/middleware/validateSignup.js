const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSignup(req, res, next) {
  const { companyName, email, password } = req.body;

  if (!companyName || !companyName.trim()) {
    return res.status(400).json({ message: "Company name is required" });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ message: "Please provide a valid email address" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  next();
}

module.exports = validateSignup;
