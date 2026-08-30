const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "1d";

async function signup({ companyName, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await Company.findOne({ email: normalizedEmail });
  if (existing) {
    const err = new Error("An account with this email already exists");
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  await Company.create({
    companyName: companyName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });
}

async function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  // password has `select: false` on the schema, so it must be requested explicitly
  const company = await Company.findOne({ email: normalizedEmail }).select("+password");

  if (!company) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const passwordMatches = await bcrypt.compare(password, company.password);

  if (!passwordMatches) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: company._id.toString(), email: company.email },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  return token;
}

module.exports = { signup, login };
