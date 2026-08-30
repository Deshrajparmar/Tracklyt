const express = require("express");
const validateSignup = require("../middleware/validateSignup");
const validateLogin = require("../middleware/validateLogin");
const authServices = require("../services/authServices");

const router = express.Router();

router.post("/signup", validateSignup, async (req, res, next) => {
  try {
    const { companyName, email, password } = req.body;
    await authServices.signup({ companyName, email, password });
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    next(err);
  }
});

router.post("/login", validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await authServices.login({ email, password });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
