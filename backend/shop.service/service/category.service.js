import category from '../models/category.model.js';

export const categoryService = {
  // create new category
  createCategory: async (data) => {
    return await category.create(data);
  },
  // fetch list category
  fetchListCategory: async () => {
    return await category.find();
  },
  // get category by id
  getCategoryById: async (idCategory) => {
    return await category.findById(idCategory);
  },
  //update category by id
  updateCategory: async (idCategory, data) => {
    return await category.findByIdAndUpdate(idCategory, data, { new: true });
  },
  //delete category
  deleteCategory: async (idCategory) => {
    return await category.findByIdAndDelete(idCategory);
  },
};
