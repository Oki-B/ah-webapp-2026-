const { verifyAccessToken } = require("../helpers/jwt.helper");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const payload = verifyAccessToken(token);

    if (!payload) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    req.user = {
      id: payload.id,
      role: payload.role,
    };

    // console.log(req.user);

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticate;
