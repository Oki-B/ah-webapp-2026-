const InviteService = require("../services/invite.services");

class AdminInviteController {
  static async createInvite(req, res) {
    try {
      const { email, roleId } = req.body;

      const invite = await InviteService.createInvite({
        email,
        roleId,
        invitedBy: req.user.id,
      });

      res.status(201).json({
        message: "Invitation sent successfully",
        data: invite,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  static async getInvites(req, res) {
    // code here
  }

  static async getInviteById(req, res) {
    // code here
  }

  static async resendInvite(req, res) {
    // code here
    try {
      const { id } = req.params;

      const result = await InviteService.resendInvite(id);

      res.status(200).json({
        message: "Invitation resent",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async cancelInvite(req, res) {
    // code here
  }
}

module.exports = AdminInviteController;
