import { HTTP_STATUS } from "../common/http-status.common.js";
import { inventoryValidation } from "../validatation/inventory.validation.js";
import inventoryModel from "../models/inventory.model.js";

export const inventoryMiddleware = async (req, res, next) => {
  const body = req.body;
  //validate
  const { error } = inventoryValidation.validate(body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((item) => item.message);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: errors,
      success: false,
    });
  }

  next();
};

