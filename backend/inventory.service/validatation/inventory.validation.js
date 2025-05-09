// inventory.validation.js
import joi from "joi";
import mongoose from "mongoose";

export const inventoryValidation = joi.object({
  productId: joi
    .string()
    .required()
    .custom((value, helper) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helper.message("productId không hợp lệ");
      }
      return true; // Cần kiểm tra xem productId có tồn tại trong bảng Product hay không
    })
    .messages({
      "string.empty": "productId không được để trống",
      "any.required": "productId là bắt buộc",
      "string.base": "productId phải là một chuỗi",
    }),
  actualStock: joi.number().required().min(1).integer().messages({
    "number.base": "actualStock phải là một số",
    "any.required": "actualStock không được để trống",
    "number.min": "actualStock phải lớn hơn hoặc bằng 1",
    "number.integer": "actualStock phải là một số nguyên",
  }),
  reserStock: joi.number().integer().min(0).default(0).messages({
    "number.base": "reserStock phải là một số",
    "number.integer": "reserStock phải là một số nguyên",
    "number.min": "reserStock phải lớn hơn hoặc bằng 0",
  }),
  avaliableStock: joi.number().integer().messages({
    "number.base": "avaliableStock phải là một số",
    "number.integer": "avaliableStock phải là một số nguyên",
  }),
  location: joi.string().max(200).messages({
    "string.max": "location không được vượt quá 200 ký tự",
    "string.base": "location phải là một chuỗi",
  }),
  lastUpdated: joi.date().optional(),
});
