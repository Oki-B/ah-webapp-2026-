const InviteService = require("../services/invite.services");

class AdminInviteController {
  static async createInvite(req, res) {
    try {
      const { email, role_id } = req.body;

      const invite = await InviteService.createInvite({
        email,
        role_id,
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
  }

  static async cancelInvite(req, res) {
    // code here
  }
}

module.exports = AdminInviteController;
