const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/mailService");
const generateOTP = require("../utils/generateOtp");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user && user.isVerified) {
     return res.status(400).json({ msg: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const otp = generateOTP();

  if (user && !user.isVerified) {
    user.password = hashed;
    user.name = name;
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
  } else {
    user = await User.create({
      name,
      email,
      password: hashed,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000
    });
  }

  await sendEmail(
    email,
    "NotesVault OTP Verification",
    `Your OTP is ${otp}. Valid for 5 minutes`
  );

  res.json({ msg: "OTP sent to email" });
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ msg: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  await user.save();

  res.json({ msg: "Account verified" });
});

router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ msg: "User not found" });
  if (user.isVerified) return res.status(400).json({ msg: "User already verified" });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendEmail(
    email,
    "NotesVault OTP Resend",
    `Your new OTP is ${otp}. Valid for 5 minutes`
  );

  res.json({ msg: "New OTP sent" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ msg: "Invalid credentials" });
  if (!user.isVerified) return res.status(400).json({ msg: "Verify OTP first" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendEmail(
    email,
    "NotesVault Password Reset OTP",
    `Your OTP is ${otp}. Valid for 5 minutes`
  );

  res.json({ msg: "OTP sent" });
});

router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.otp = null;
  await user.save();

  res.json({ msg: "Password reset successful" });
});

module.exports = router;