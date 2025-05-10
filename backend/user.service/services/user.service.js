import { get } from "mongoose";
import User from "../models/userModel.js";

export const userService = {
  //fetch list user
  getAllUsers: async () => {
    try {
      return (result = await User.find()); //get all user
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  },
  getUserById: async (userId) => {
    try {
      return (result = await User.findById(userId)); //get user by id
    } catch (error) {
      throw new Error("Error fetching user: " + error.message);
    }
  },
  deleteUser: async (userId) => {
    try {
      return (result = await User.findByIdAndDelete(userId)); //delete user by id
    } catch (error) {
      throw new Error("Error deleting user: " + error.message);
    }
  },
  updateUser: async (userid, data) => {
    return await User.findByIdAndUpdate(userid, data, { new: true });
  },
  getUserByEmail: async (email) => {
    try {
      return (result = await User.findOne({ email })); //get user by email
    } catch (error) {
      throw new Error("Error fetching user: " + error.message);
    }
  },
};
