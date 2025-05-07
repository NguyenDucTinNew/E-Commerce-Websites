import joi from "joi";
import mongoose from "mongoose";

export const productValidation = joi.object({
  name: joi.string().required().messages({
    "string.empty": "Tên sản phẩm không được để trống",
    "any.required": "Tên sản phẩm là bắt buộc",
  }),
  description: joi.string().required().messages({
    "string.empty": "Mô tả sản phẩm không được để trống",
    "any.required": "Mô tả sản phẩm là bắt buộc",
  }),
  price: joi.number().required().min(0).messages({
    "number.base": "Giá phải là một số",
    "any.required": "Giá không được để trống",
    "number.min": "Giá không được âm",
  }),
  stock: joi.number().required().min(0).messages({
    "number.base": "Tồn kho phải là một số",
    "any.required": "Tồn kho không được để trống",
    "number.min": "Tồn kho không được âm",
  }),
  categoryId: joi
    .string()
    .required()
    .custom((value, helper) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helper.message("Mã loại hàng không hợp lệ");
      }
      return true; // Nếu không có kiểm tra tồn tại trong cơ sở dữ liệu
    }),
  images: joi.array().items(joi.string().uri().required()).required().messages({
    "array.base": "Hình ảnh phải là một mảng",
    "any.required": "Danh sách hình ảnh không được để trống",
    "string.uri": "URL hình ảnh không hợp lệ",
  }),
  createdAt: joi.date().optional(),
  updatedAt: joi.date().optional(),
});
