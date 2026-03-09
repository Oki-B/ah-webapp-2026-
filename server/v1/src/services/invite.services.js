const { sendInvitationEmail } = require("../helpers/email.helper");
const { generateToken, hashToken } = require("../helpers/token.helper");
const { UserInvite, User } = require("../models");
const { withTransaction } = require("../helpers/transaction.helper");
const { maskEmail } = require("../helpers/mask.helper");

class InviteService {
  static async createInvite({ email, roleId, invitedBy }) {
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
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

    return invitation;
  }

  static async getInviteByToken(token) {
    const tokenHash = hashToken(token);

    const invite = await UserInvite.findOne({
      where: {
        tokenHash: tokenHash,
      },
    });

    console.log(invite.expiresAt);

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

      return user;
    });
  }
}

module.exports = InviteService;
