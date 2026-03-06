const { comparePassword } = require("../helpers/bcrypt");
const { User } = require("../models");

class AuthController {
  // Controller methods would go here
  static async login(req, res) {
    try {
      // Login logic
      const { email, password } = req.body;
      // Validate input, find user, compare password, generate token, etc.
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }

      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      if (!user.isEmailVerified) {
        return res.status(403).json({ message: "Email not verified" });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: "Account is inactive" });
      }

      // Update last login time
      user.lastLoginAt = new Date();
      await user.save();

      // Generate JWT token (not implemented here, but you would typically do this)

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = AuthController;
