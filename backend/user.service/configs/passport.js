import User from "../models/userModel.js"; // Đảm bảo đường dẫn đúng
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import passport from "passport";

// Cấu hình Passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "No user found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize và Deserialize
passport.serializeUser((user, done) => {
  done(null, user.id); // Lưu ID người dùng vào session
  // Lưu role người dùng vào session nếu cần thiết
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Tìm người dùng theo ID

    done(null, user); // Lưu thông tin người dùng vào req.user
  } catch (error) {
    done(error);
  }
});

export default passport;
