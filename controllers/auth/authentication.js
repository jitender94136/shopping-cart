const jwt = require('../../helpers/jwt_helper');
const { success, error } = require('../../helpers/responseApi');

exports.login = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    const token = await jwt.signAccessToken(userId, role);
    const refreshToken = await jwt.signRefreshToken(userId, role);
    const successResponse = {
      message: '',
      code: 201,
      results: {
        user_id: userId,
        access_token: token,
        refresh_token: refreshToken,
      },
    };
    res.send(success(successResponse));
  } catch (err) {
    next(error(err.message, 500));
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(error('Unauthorized', 401));
    }
    const { userId, role } = await jwt.verifyRefreshToken(refreshToken);
    const newAccessToken = await jwt.signAccessToken(userId, role);
    const newRefreshToken = await jwt.signRefreshToken(userId);
    const successResponse = {
      results: {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      },
      code: 200,
    };
    return res.send(success(successResponse));
  } catch (err) {
    return next(error(err.message, 401));
  }
};

exports.logout = () => {

};
