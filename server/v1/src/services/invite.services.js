const { sendInvitationEmail } = require("../helpers/email.helper");
const { generateToken, hashToken } = require("../helpers/token.helper");
const { UserInvite, User } = require("../models");

class InviteService {
  static async createInvite({ email, role_id, invitedBy }) {
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
      roleId: role_id,
      invitedBy: invitedBy,
      tokenHash: tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 jam
    });

    // kirim email invite di sini, gunakan token untuk link pendaftaran
    await sendInvitationEmail(email, token);

    return invitation;
  }
}

module.exports = InviteService;
