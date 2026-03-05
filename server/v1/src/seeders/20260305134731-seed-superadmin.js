"use strict";

require("dotenv").config();
const { hashPassword } = require("../helpers/bcrypt");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await hashPassword(process.env.SUPERADMIN_PASSWORD);

    const roleId = await queryInterface.rawSelect(
      "roles",
      { where: { name: "superadmin" } },
      ["id"],
    );

    await queryInterface.bulkInsert("users", [
      {
        id: uuidv4(),
        email: process.env.SUPERADMIN_EMAIL,
        password: hashedPassword,
        role_id: roleId,
        is_email_verified: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", {
      email: process.env.SUPERADMIN_EMAIL,
    });
  },
};
