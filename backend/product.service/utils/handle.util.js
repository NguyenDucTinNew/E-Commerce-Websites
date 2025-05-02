export const wrapRequestHandler = (func) => {
  return async (req, res, next) => {
    //Xử lý bất đồng bộ trong express
    try {
      await func(req, res, next);
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  };
};
