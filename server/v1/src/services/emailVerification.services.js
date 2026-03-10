const { sendVerificationEmail } = require("../helpers/email.helper");
const { hashToken, generateToken } = require("../helpers/token.helper");
const { Op } = require("sequelize");
const { User, EmailVerification } = require("../models");

class EmailVerificationService {
  static async createVerification(userId, email, transaction = null) {
    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Token valid for 1 hours

    const verificationRecord = await EmailVerification.create(
      {
        userId,
        tokenHash,
        expiresAt,
        attempts: 0,
      },
      { transaction },
    );

    await sendVerificationEmail(email, rawToken);

    return verificationRecord;
  }

  static async verifyEmail(token) {
    const tokenHash = hashToken(token);
    const verification = await EmailVerification.findOne({
      where: { tokenHash },
      include: {
        model: User,
        attributes: ["id", "email", "isEmailVerified", "isActive"],
      },
    });

    if (!verification) {
      throw new Error("Invalid verification token");
    }

    if (verification.usedAt) {
      throw new Error("Verification token already used");
    }

    if (verification.expiresAt < new Date()) {
      throw new Error("Verification token expired");
    }

    if (verification.User.isEmailVerified) {
      throw new Error("Email already verified");
    }

    // update user
    await verification.User.update({
      isEmailVerified: true,
      isActive: true,
    });

    // mark verification used
    await verification.update({
      usedAt: new Date(),
    });

    return verification.User;
  }

  static async resendVerification(email) {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      throw new Error("If the email exist, a verification email has been sent"); // Avoid user enumeration
    }

    if (user.isEmailVerified) {
      throw new Error("Email already verified");
    }

    const verification = await EmailVerification.findOne({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    if (!verification) {
      throw new Error("No active verification found, please request a new one");
    }

    const now = new Date();
    /**
     * reset attempts kalau expired
     */
    if (verification.expiresAt < now) {
      const { rawToken, tokenHash } = generateToken();

      await verification.update({
        tokenHash,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        attempts: 0,
      });

      return rawToken;
    }

    if (verification.attempts >= 3) {
      throw new Error("Verification resend limit reached");
    }

    /**
     * cooldown 1 menit
     */
    const cooldown = 60 * 1000;

    if (now - verification.updatedAt < cooldown) {
      throw new Error(
        "Please wait before requesting another verification email",
      );
    }

    // generate token baru
    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);

    await verification.update({
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      attempts: verification.attempts + 1,
    });

    return {
      rawToken,
      verification,
    };
  }
}

module.exports = EmailVerificationService;
