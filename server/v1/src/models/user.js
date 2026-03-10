"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt.helper");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsTo(models.Role, {
        foreignKey: "role_id",
      });
      models.User.hasMany(models.EmailVerification, {
        foreignKey: "user_id",
      });
      models.User.hasMany(models.AuthProvider, {
        foreignKey: "user_id",
      });
    }
  }
  User.init(
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
        unique: {
          msg: "Email already registered",
        },
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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password wajib diisi",
          },
          notEmpty: {
            msg: "Password tidak boleh kosong",
          },
          isStrongPassword(value) {
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;

            if (!regex.test(value)) {
              throw new Error(
                "Password minimal 12 karakter, harus ada huruf besar, huruf kecil, dan angka",
              );
            }
          },
        },
      },
      isEmailVerified: {
        field: "is_email_verified",
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        field: "is_active",
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      roleId: {
        field: "role_id",
        type: DataTypes.UUID,
        allowNull: false,
      },
      lastLoginAt: {
        field: "last_login_at",
        type: DataTypes.DATE,
      },
    },
    {
      hooks: {
        beforeCreate: async (user, options) => {
          if (user.password) {
            user.password = await hashPassword(user.password);
          }
        },
      },
      sequelize,
      modelName: "User",
      underscored: true,
    },
  );
  return User;
};
