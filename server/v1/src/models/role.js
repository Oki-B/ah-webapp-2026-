'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Role.hasMany(models.User, {
        foreignKey: "role_id",
      });
    }
  }
  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Role name must be unique",
      },
      validate: {
        notEmpty: {
          msg: "Role name cannot be empty",
        },
        notNull: {
          msg: "Role name is required",
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Role',
    underscored: true,
  });
  return Role;
};