import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Role from "../models/roleModel.js"; // Import model Role
import { HTTP_STATUS } from "../common/http-status.common.js"; // Import mã trạng thái HTTP

export const register = async (req, res) => {
  const { username, password, role, email } = req.body;

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

    // Kiểm tra và lấy ID của role
    const foundRole = await Role.findOne({ name: role });
    if (!foundRole) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Role not found", success: false });
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: foundRole._id, // Lưu ID của role
    });

    console.log("New User Created:", {
      username,
      email,
      role,
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Generated JWT:", token);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
};

export const getProfile = (req, res) => {
  res.json(req.user);
};
