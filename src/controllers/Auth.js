const Company = require("../models/company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { companyName, email, password } = req.body;

    const existing = await Company.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Company already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
      companyName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: company._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};
