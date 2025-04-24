import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Role from "../models/roleModel.js"; // Import model Role
import { HTTP_STATUS } from "../common/http-status.common.js"; // Import mã trạng thái HTTP

export const register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Kiểm tra sự tồn tại của tên người dùng
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Username already exists", success: false });
    }

    // Kiểm tra sự tồn tại của email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Email already exists", success: false });
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "67fe60dab95566e66a97431c", // Lưu ID của role
    });

    console.log("New User Created:", {
      username,
      email,
    });
    await newUser.save();
    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "User registered successfully", success: true });
  } catch (err) {
    console.error(err);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error registering user", success: false });
  }
};
/*
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send("User not found");
    }

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Incorrect password");
    }

    // Lưu thông tin người dùng vào phiên làm việc
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.role = user.role; // Lưu role vào phiên làm việc

    console.log("User logged in:", { username: user.username });
    res.status(200).json({ message: "Login successful", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
};
*/
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.status(200).send("Logged out successfully");
  });
};

export const getProfile = (req, res) => {
  res.json(req.user);
};
