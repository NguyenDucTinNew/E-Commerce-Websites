import User from "../models/userModel.js"; // Đảm bảo đường dẫn đúng
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

// Cấu hình Passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Tìm kiếm người dùng theo tên đăng nhập
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "No user found" });
      }

      // So sánh mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      // Nếu xác thực thành công, trả về người dùng
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize và Deserialize
passport.serializeUser((user, done) => {
 
  done(null, user.id);// Lưu ID người dùng vào session
  // Lưu role người dùng vào session nếu cần thiết
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Lưu thông tin người dùng vào req.user
  } catch (error) {
    done(error);
  }
});
