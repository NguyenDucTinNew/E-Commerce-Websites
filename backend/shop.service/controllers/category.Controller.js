import { HTTP_STATUS } from '../common/http-status.common.js';
import { categoryService } from '../service/category.service.js';

export const categoryController = {
  createCategory: async (req, res) => {
    const body = req.body;
    console.log(body);
    // create
    const newCategory = await categoryService.createCategory(body);
    if (!newCategory)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Tạo danh mục thất bại',
        success: false,
      });

    return res.status(HTTP_STATUS.OK).json({
      message: 'Tạo danh mục thành công!',
      success: true,
      data: newCategory,
    });
  },
  //get category
  getCategoryById: async (req, res) => {
    const { idCategory } = req.params;
    // get category detail
    const category = await categoryService.getCategoryById(idCategory);
    if (!category)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Tải loại sản phẩm thất bại!',
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: 'Tải loại sản phẩm thành công!',
      success: true,
      data: category,
    });
  },
  //fetch list category
  fetchListCategory: async (req, res) => {
    //fetch list
    const listCategory = await categoryService.fetchListCategory();
    if (!listCategory)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Tải danh sách loại sản phẩm thất bại!',
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: 'Tải danh sách loại sản phẩm thành công!',
      success: true,
      data: listCategory,
    });
  },
  //update category
  updateCategory: async (req, res) => {
    const body = req.body;
    const { idCategory } = req.params;
    //update
    const result = await categoryService.updateCategory(idCategory, body);
    if (!result)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Cập nhật loại sản phẩm thất bại!',
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: 'Cập nhật loại sản phẩm thành công!',
      success: true,
      data: result,
    });
  },
  //delete category
  deleteCategory: async (req, res) => {
    const { idCategory } = req.params;
    //delete category
    const result = await categoryService.deleteCategory(idCategory);
    if (!result)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Xóa loại sản phẩm thất bại!',
        success: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: 'Xóa loại sản phẩm thành công!',
      success: true,
    });
  },
};
