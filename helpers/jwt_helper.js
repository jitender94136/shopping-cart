const JWT = require('jsonwebtoken');
require('dotenv').config();
const { error } = require('./responseApi');

const secret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

module.exports = {
  signAccessToken(userId, role) {
    return new Promise((resolve, reject) => {
      const options = {
        expiresIn: '1h',
        issuer: 'https://github.com/jitender94136',
        audience: userId,
      };
      const payload = {
        userId,
        role,
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    });
  },

  // eslint-disable-next-line consistent-return
  verifyAccessToken: (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(error('', 401));
    }
    try {
      const [bearer, token] = req.headers.authorization.split(' ');
      if (bearer !== 'Bearer') {
        return next(error('', 401));
      }
      JWT.verify(token, secret, (err, payload) => {
        if (err) {
          return next(error(err.message, 401));
        }
        req.jwt = payload;
        return next();
      });
    } catch (err) {
      return next(error('', 401));
    }
  },

  signRefreshToken: (userId, role) => new Promise((resolve, reject) => {
    const options = {
      expiresIn: '1y',
      issuer: 'https://github.com/jitender94136',
      audience: userId,
    };
    const payload = {
      role,
    };
    JWT.sign(payload, refreshTokenSecret, options, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  }),

  verifyRefreshToken: (refreshToken) => new Promise((resolve, reject) => {
    // eslint-disable-next-line consistent-return
    JWT.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) return reject(err);
      const userId = payload.aud;
      const { role } = payload.role;
      resolve(userId, role);
    });
  }),
};
