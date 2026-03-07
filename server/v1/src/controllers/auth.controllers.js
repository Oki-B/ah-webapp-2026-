const AuthService = require("../services/auth.services");

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const accessToken = await AuthService.login(email, password);

      res.status(200).json({
        message: "Login success",
        accessToken,
      });

    } catch (error) {

      if (error.message === "INVALID_EMAIL") {
        return res.status(401).json({ message: "Invalid email" });
      }

      if (error.message === "INVALID_PASSWORD") {
        return res.status(401).json({ message: "Invalid password" });
      }

      if (error.message === "EMAIL_NOT_VERIFIED") {
        return res.status(403).json({ message: "Email not verified" });
      }

      if (error.message === "ACCOUNT_INACTIVE") {
        return res.status(403).json({ message: "Account is inactive" });
      }

      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = AuthController;