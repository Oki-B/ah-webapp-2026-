"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("auth_providers", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      provider: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      provider_id: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("auth_providers", {
      fields: ["provider", "provider_id"],
      type: "unique",
      name: "unique_provider_provider_id",
    });

    await queryInterface.addConstraint("auth_providers", {
      fields: ["user_id", "provider"],
      type: "unique",
      name: "unique_user_provider",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("auth_providers");
  },
};
