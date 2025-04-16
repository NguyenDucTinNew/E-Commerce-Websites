import joi from 'joi';

export const categoryValidation = joi.object({
  nameCategory: joi.string().required().messages({
    'string.empty': 'Tên danh mục không được để trống',
    'any.required': 'Tên danh mục không được để trống',
  }),
  desc: joi.string(),
  Images: joi.array().items(
    joi.object({
      url: joi.string().uri(),
      public_id: joi.string(),
    }),
  ),
  is_deleted: joi.boolean().default(false),
});
