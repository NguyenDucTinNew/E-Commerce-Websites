import axios from "axios";
import config from "../../config.js";
import { HTTP_STATUS } from "../../common/http-status.common.js";
import { getProfile } from "../../../user.service/controllers/userController.js";

export const userController = {
  //Fetch list user
  fetchListUser: async (req, res) => {
    const result = await axios.get(
      `${process.env.USER_SERVICE_URL}/getallusers`
    );
    if (!result)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Tải dữ liệu người dùng thất bại!",
        sucess: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: "Tải dữ liệu người dùng thành công!",
      sucess: true,
      data: result.data,
    });
  },
  getProfile: async (req, res) => {
    const { idUser } = req.params;
    const result = await axios.get(`${process.env.USER_SERVICE_URL}/profile`);
    if (!result)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Không thể tải dữ liệu người dùng!",
        sucess: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: "Tải dữ liệu người dùng thành công!",
      sucess: true,
      data: result.data,
    });
  },
  //Get user by id
  getUserById: async (req, res) => {
    const { idUser } = req.params;
    const result = await axios.get(
      `${process.env.USER_SERVICE_URL}/getuserbyid/${idUser}`
    );
    if (!result)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Không thể tải dữ liệu người dùng!",
        sucess: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: "Tải dữ liệu người dùng thành công!",
      sucess: true,
      data: result.data,
    });
  },
  //update user by id
  updateUserById: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const result = await axios.put(
      `${process.env.USER_SERVICE_URL}/user/${id}`,
      data,
      config
    );
    if (!result)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Cập nhật thông tin thất bại!",
        sucess: false,
      });
    return res.status(HTTP_STATUS.OK).json({
      message: "Cập nhật thông tin thành công!",
      sucess: true,
    });
  },
  test: async (req, res) => {
    return res.status(HTTP_STATUS.OK).json({
      message: "Test success",
      success: true,
    });
  },
};
