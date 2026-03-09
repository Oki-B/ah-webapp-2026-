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
    try {
      const invites = await InviteService.getInvites();
      res.status(200).json({
        message: "Invites retrieved successfully",
        data: invites,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  static async getInviteById(req, res) {
    // code here
    try {
      const { id } = req.params;

      const invite = await InviteService.getInviteById(id);

      res.status(200).json({
        message: "Invite retrieved successfully",
        data: invite,
      });
    } catch (error) {
      res.status(404).json({
        message: error.message || "Invite not found",
      });
    }
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
    try {
      const { id } = req.params;

      const result = await InviteService.deleteInvite(id);

      res.status(200).json({
        message: "Invitation cancelled",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

}

module.exports = AdminInviteController;
