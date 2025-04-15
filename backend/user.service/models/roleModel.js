import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
// Định nghĩa schema cho role
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

roleSchema.plugin(mongoosePaginate);
// Tạo model từ schema
const Role = mongoose.model("Role", roleSchema, "Role");

export default Role;
