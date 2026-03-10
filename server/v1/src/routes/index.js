const express = require("express");
const router = express.Router();
const inviteRouter = require("./invite.routes");
const authRouter = require("./auth.routes");
const adminRouter = require("./admin.routes");
const authenticate = require("../middleware/auth.middleware");

router.get("/home", (req, res) => {
  res.json({ message: "Welcome to the API from router" });
});

router.use("/invites", inviteRouter);
// Use the auth routes
router.use("/auth", authRouter);

router.use(authenticate);

router.use("/admin", adminRouter);
module.exports = router;
