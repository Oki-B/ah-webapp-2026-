const express = require("express");
const AuthController = require("../controllers/auth.controllers");
const VerifyEmailController = require("../controllers/verifyEmail.controller");
const authorizeRole = require("../middleware/role.middleware");
const router = express.Router();

// Define routes for authentication
router.post("/login", AuthController.login);
router.post("/verify-email", VerifyEmailController.verifyEmail);
router.post("/resend-verification", VerifyEmailController.resendVerification);
// You can add more routes like /register, /logout, /refresh-token, etc.

module.exports = router;
