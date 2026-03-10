const EmailVerificationService = require("../services/emailVerification.services");

class VerifyEmailController {
  static async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      const user = await EmailVerificationService.verifyEmail(token);

      res.status(200).json({
        message: "Email verified successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async resendVerification(req, res) {
    try {
      const { email } = req.body;

      const verification =
        await EmailVerificationService.resendVerification(email);

      res.status(200).json({
        message: "If the email exist, a verification email has been sent", // Avoid user enumeration
        data: verification,
      });
    } catch (error) {
      res.status(400).json({
        message: "If the email exist, a verification email has been sent", // Avoid user enumeration
      });
    }
  }
}

module.exports = VerifyEmailController;