const InviteService = require("../services/invite.services");

class InviteController {
  static async getInviteByToken(req, res) {
    try {
      const { token } = req.params;

      const invite = await InviteService.getInviteByToken(token);

      res.status(200).json({
        message: "Invitation found",
        data: invite,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async acceptInvitation(req, res) {
    try {
      const { token, password } = req.body;

      const user = await InviteService.acceptInvitation({
        token,
        password,
      });

      res.status(201).json({
        message: "Invitation accepted",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}

module.exports = InviteController;
