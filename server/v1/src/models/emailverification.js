"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmailVerification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EmailVerification.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  EmailVerification.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        field: "user_id",
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      tokenHash: {
        field: "token_hash",
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        field: "expires_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      usedAt: {
        field: "used_at",
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "EmailVerification",
      underscored: true,
      updatedAt: false,
    },
  );
  return EmailVerification;
};
