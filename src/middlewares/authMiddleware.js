const authTokenExplorer = require("../utils/authTokenExplorer");
const UserService = require("../services/UserServices");
const { MSG_TYPES, ACCOUNT_TYPES } = require("../../constants/types");
const { appResponse, appResponseWithoutRes } = require("../../lib/appResponse");

exports.identify = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) return appResponse(res, 401, MSG_TYPES.NO_TOKEN);

    const decoded = await authTokenExplorer.decodeToken(token);

    const user = await UserService.findById(decoded.id);
    if (user) {
      req.auth = user;
      return next();
    }

    return appResponse(res, 401, MSG_TYPES.INVALID_TOKEN);
  } catch (err) {
    return appResponse(res, 500, MSG_TYPES.SERVER_ERROR(err.message));
  }
};
