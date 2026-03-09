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
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
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
        type: DataTypes.UUID,
        allowNull: false,
      },
      tokenHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      invitedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      resendCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      acceptedAt: {
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
