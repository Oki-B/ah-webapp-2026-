const express = require("express");
const AuthController = require("../controllers/auth.controllers");
const router = express.Router();

// Define routes for authentication
router.post("/login", AuthController.login);
// You can add more routes like /register, /logout, /refresh-token, etc.

module.exports = router;
