const express = require("express");
const router = express.Router();
const authRouter = require("./auth.routes");

router.get("/home", (req, res) => {
  res.json({ message: "Welcome to the API from router" });
});

// Use the auth routes
router.use("/auth", authRouter);
module.exports = router;