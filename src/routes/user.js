const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const AUTH_SECRET = process.env.AUTH_SECRET || "test-secret";

router.post("/register", async (req, res) => {
  // Get the body from the information sent in by the user/client.
  const { email, password } = req.body;

  // If it doesn't exist then handle it
  if (!email || !password)
    res.status(400).json({
      success: false,
      message: "Something is wrong with the data you have sent",
    });

  // DEBUG
  // await User.deleteMany();

  // Auto generate the password hash using bcrypt
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Create the user with the password hash
  const response = await User.create({
    email: email,
    password: passwordHash,
  });

  // Send back the success message for the user
  res.status(201).json({ success: true, message: `${email} has been created` });
});

router.post("/login", async (req, res) => {
  // Get the body from the information sent in by the user/client.
  const { email, password } = req.body;

  // If it doesn't exist then handle it
  if (!email || !password)
    res.status(400).json({
      success: false,
      message: "Something is wrong with the data you have sent",
    });

  // If the data exists, find the user
  const user = await User.findOne({ email: email });

  // If the user doesn't exist then handle that
  if (!user)
    res
      .status(404)
      .json({ success: false, message: "This user does not exist" });

  // Check that the password sent in is valid

  const validPassword = await bcrypt.compare(password, user.password);

  // If the password is not valid, then handle it
  if (!validPassword)
    res.status(400).json({
      success: false,
      message: "Something is wrong with your email or password",
    });

  // If the password is correct, and the user has been found, then create an authentication token
  const authToken = await jwt.sign(
    { id: user._id, email: user.email },
    AUTH_SECRET,
    { expiresIn: "1h" }
  );

  // Send back a success with the auth token attached
  res.status(200).json({ success: true, token: authToken });
});

module.exports = router;
