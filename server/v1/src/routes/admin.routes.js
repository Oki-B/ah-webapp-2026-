const express = require("express");
const authorizeRole = require("../middleware/role.middleware");
const AdminInviteController = require("../controllers/adminInvite.controller");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "It's on admin router" });
});

router.use(authorizeRole("superadmin"));
router.post("/invites", AdminInviteController.createInvite)
// router.get("/invites")
// router.get("/invites/:id")
router.post("/invites/:id/resend", AdminInviteController.resendInvite)
// router.delete("/invites/:id")

module.exports = router;
