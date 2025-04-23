import { HTTP_STATUS } from "../common/http-status.common.js";
import { userValidation } from "../validation/userValidation.js"; // Đảm bảo đường dẫn đúng
import passport from "passport";

// Middleware kiem tra nguoi dung
export const authMiddleware = async (req, res, next) => {
    const body = req.body;
    // Validate
    const { error } = userValidation.validate(body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((item) => item.message);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: errors,
            success: false,
        });
    }

    next(); // Tiếp tục đến route handler
};

// Middleware kiểm tra xác thực *** Check session id được lưu trong cookie

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
};


