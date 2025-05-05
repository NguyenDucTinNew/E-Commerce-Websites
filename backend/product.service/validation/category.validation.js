import joi from "joi";

export const categoryValidation = joi.object({
  name: joi.string().required().messages({
    "string.empty": "Tên danh mục không được để trống",
    "any.required": "Tên danh mục là bắt buộc",
  }),
  createdAt: joi.date().optional(),
  updatedAt: joi.date().optional(),
});
