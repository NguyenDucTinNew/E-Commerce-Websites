import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
// Định nghĩa schema cho người dùng
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    ref: "Role", // Liên kết đến model Role
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.plugin(mongoosePaginate);
// Tạo model từ schema
const User = mongoose.model("User", userSchema, "User");

export default User;
