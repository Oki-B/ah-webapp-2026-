const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt.helper");
const { generateAccessToken } = require("../helpers/jwt.helper");

class AuthService {
  static async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("INVALID_EMAIL");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("INVALID_PASSWORD");
    }

    if (!user.isEmailVerified) {
      throw new Error("EMAIL_NOT_VERIFIED");
    }

    if (!user.isActive) {
      throw new Error("ACCOUNT_INACTIVE");
    }

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role_id,
      email: user.email,
    });

    return accessToken;
  }
}

module.exports = AuthService;