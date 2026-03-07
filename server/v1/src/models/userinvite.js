"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserInvite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserInvite.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });
      UserInvite.belongsTo(models.User, {
        foreignKey: "invited_by",
        as: "inviter",
      });
    }
  }
  UserInvite.init(
    {
      email: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Email must be a valid email address",
          },
          notEmpty: {
            msg: "Email cannot be empty",
          },
          notNull: {
            msg: "Email is required",
          },
        },
      },
      roleId: { 
        field: "role_id",
        type: DataTypes.UUID, 
        allowNull: false,
      },
      tokenHash: { 
        field: "token_hash",
        type: DataTypes.STRING, 
        allowNull: false,
      },
      invitedBy: { 
        field: "invited_by",
        type: DataTypes.UUID, 
        allowNull: false,
      },
      expiresAt: { 
        field: "expires_at",
        type: DataTypes.DATE, 
        allowNull: false,
      },
      resendCount:{
        field: "resend_count",
        type: DataTypes.INTEGER,
        allowNull: false
      },
      acceptedAt: { 
        field: "accepted_at",
        type: DataTypes.DATE, 
      },
    },
    {
      sequelize,
      modelName: "UserInvite",
      underscored: true,
    },
  );
  return UserInvite;
};
