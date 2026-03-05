"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuthProvider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AuthProvider.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  AuthProvider.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      providerId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "AuthProvider",
      indexes: [
        {
          unique: true,
          fields: ["provider", "provider_id"],
        },
        {
          unique: true,
          fields: ["user_id", "provider"],
        },
      ],

      underscored: true,
    },
  );
  return AuthProvider;
};
