const { sendInvitationEmail } = require("../helpers/email.helper");
const { generateToken, hashToken } = require("../helpers/token.helper");
const { UserInvite, User } = require("../models");
const { withTransaction } = require("../helpers/transaction.helper");
const { maskEmail } = require("../helpers/mask.helper");

class InviteService {
  // from this line is Services only for superadmin

  static async getInvites() {
    const invites = await UserInvite.findAll({
      attributes: {
        exclude: [
          "tokenHash",
          "createdAt",
          "updatedAt",
          "invited_by",
          "role_id",
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    return invites;
  }

  static async getInviteById(id) {
    const invite = await UserInvite.findByPk(id, {
      attributes: {
        exclude: [
          "tokenHash",
          "createdAt",
          "updatedAt",
          "invited_by",
          "role_id",
        ],
      },
    });

    if (!invite) {
      throw new Error("Invitation not found");
    }

    return invite;
  }

  static async createInvite({ email, roleId, invitedBy }) {
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingInvite = await UserInvite.findOne({
      where: { email },
    });

    if (existingInvite) {
      throw new Error("Invitation already sent to this email");
    }

    const token = generateToken();
    const tokenHash = hashToken(token);

    const invitation = await UserInvite.create({
      email,
      roleId,
      invitedBy,
      tokenHash: tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 jam
    });

    // kirim email invite di sini, gunakan token untuk link pendaftaran
    await sendInvitationEmail(email, token);

    return {
      id: invitation.id,
      email: invitation.email,
      roleId: invitation.roleId,
      expiresAt: invitation.expiresAt,
    };
  }

  static async resendInvite(id) {
    return withTransaction(async (transaction) => {
      const invitation = await UserInvite.findByPk(id, { transaction });

      if (!invitation) {
        throw new Error("Invitation not found");
      }

      if (invitation.acceptedAt) {
        throw new Error("Invitation already accepted");
      }

      if (new Date() > invitation.expiresAt) {
        throw new Error("Invitation already expired");
      }

      if (invitation.resendCount > 3) {
        throw new Error("Maximum resend attempts reached");
      }

      const token = generateToken();
      const tokenHash = hashToken(token);

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await invitation.update(
        {
          tokenHash,
          expiresAt,
          resendCount: invitation.resendCount + 1,
        },
        { transaction },
      );

      console.log(invitation.email);

      await sendInvitationEmail(invitation.email, token);

      return {
        id: invitation.id,
        email: invitation.email,
        roleId: invitation.roleId,
        expiresAt: invitation.expiresAt,
      };
    });
  }

  static async deleteInvite(id) {
    const invite = await UserInvite.findByPk(id);

    if (!invite) {
      throw new Error("Invitation not found");
    }

    if (invite.acceptedAt) {
      throw new Error("Cannot delete accepted invitation");
    }

    await invite.destroy();

    return true;
  }

  static async clearInvites() {
    try {
      await UserInvite.destroy({
        where: {
          acceptedAt: null,
          expiresAt: {
            [Op.lt]: new Date(),
          },
        },
      });

      return true;
    } catch (error) {
      throw new Error("Failed to clear expired invitations");
    }
  }

  // from this line is Services for public user / admin
  static async getInviteByToken(token) {
    const tokenHash = hashToken(token);

    const invite = await UserInvite.findOne({
      where: {
        tokenHash: tokenHash,
      },
    });

    if (!invite) {
      throw new Error("Invalid invitation token");
    }

    if (invite.acceptedAt) {
      throw new Error("Invitation already used");
    }

    if (new Date() > invite.expiresAt) {
      throw new Error("Invitation expired");
    }

    return {
      email: maskEmail(invite.email),
      roleId: invite.roleId,
      expiresAt: invite.expiresAt,
    };
  }

  static async acceptInvitation({ token, password }) {
    return withTransaction(async (transaction) => {
      const tokenHash = hashToken(token);

      const invite = await UserInvite.findOne({
        where: { tokenHash },
        transaction,
      });

      const user = await User.create(
        {
          email: invite.email,
          password: password,
          roleId: invite.roleId,
        },
        { transaction },
      );

      await invite.update(
        {
          acceptedAt: new Date(),
        },
        { transaction },
      );

      return;
    });
  }
}

module.exports = InviteService;
