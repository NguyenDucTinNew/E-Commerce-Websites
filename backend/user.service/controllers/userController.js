import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User registered");
  } catch (err) {
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

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send("Incorrect password");
    }

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Error logging in");
  }
};

export const getProfile = (req, res) => {
  res.json(req.user);
};
