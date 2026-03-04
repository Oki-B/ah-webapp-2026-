require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || null,
    database: process.env.DATABASE_NAME || "database_development",
    host: process.env.DATABASE_HOST || "127.0.0.1",
    dialect: process.env.DATABASE_DIALECT || "postgres"
  },
  test: {
    username: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || null,
    database: process.env.DATABASE_NAME_TEST || "database_test",
    host: process.env.DATABASE_HOST || "127.0.0.1",
    dialect: process.env.DATABASE_DIALECT || "postgres"
  },
  production: {
    username: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || null,
    database: process.env.DATABASE_NAME_PROD || "database_production",
    host: process.env.DATABASE_HOST || "127.0.0.1",
    dialect: process.env.DATABASE_DIALECT || "postgres"
  }
};