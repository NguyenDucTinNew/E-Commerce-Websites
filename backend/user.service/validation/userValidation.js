import joi from 'joi';

// Xác thực thông tin người dùng
export const userValidation = joi.object({
  username: joi.string()
    .min(3)
    .required()
    .messages({
      'string.empty': 'Tên người dùng không được để trống.',
      'string.min': 'Tên người dùng phải có ít nhất 3 ký tự.',
      'any.required': 'Tên người dùng là bắt buộc.',
    }),
  
  email: joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email không được để trống.',
      'string.email': 'Email không hợp lệ.',
      'any.required': 'Email là bắt buộc.',
    }),

  password: joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Mật khẩu không được để trống.',
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự.',
      'any.required': 'Mật khẩu là bắt buộc.',
    }),
});