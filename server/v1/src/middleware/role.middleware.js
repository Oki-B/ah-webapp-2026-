const { Role } = require("../models");

const authorizeRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userRoleId = req.user.role;
    //   console.log(userRoleId)

      const userRole = await Role.findByPk(userRoleId);
    //   console.log(userRole)

      if (!allowedRoles.includes(userRole.name)) {
        return res.status(403).json({
          message: "Forbidden: insufficient permissions",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
};

module.exports = authorizeRole;
