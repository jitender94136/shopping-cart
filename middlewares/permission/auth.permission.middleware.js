const config = require('../../shared/config')
const ADMIN_PERMISSION = config.role.ADMIN;

exports.testMinimumPrivilige = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.jwt.role);
        if (user_permission_level >= required_permission_level) {
            return next();
        } else {
            return res.status(403).send();
        }
    };
};

exports.onlyForUserOrAdmin = (req, res, next) => {
    let user_permission_level = parseInt(req.jwt.role);
    let userId = req.jwt.userId;
    if (req.params && req.params.userId && userId === req.params.userId) {
        return next();
    } else {
        if (user_permission_level == ADMIN_PERMISSION) {
            return next();
        } else {
            return res.status(403).send();
        }
    }
};