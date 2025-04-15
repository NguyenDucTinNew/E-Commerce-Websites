import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Role from "../models/roleModel.js"; // Import model Role

export const register = async (req, res) => {
  const { username, password, role, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kiểm tra và lấy ID của role
    const foundRole = await Role.findOne({ name: role });
    if (!foundRole) {
      return res.status(400).send("Role not found");
    }

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
    res.status(201).send("User registered");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user");
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
