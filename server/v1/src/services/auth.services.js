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
      role: user.roleId,
      email: user.email,
    });

    return accessToken;
  }

  static async logout(userId) {
    // For JWT, logout is typically handled on the client side by deleting the token.
    // Optionally, you can implement token blacklisting on the server side if needed.
    return;
  }
}

module.exports = AuthService;