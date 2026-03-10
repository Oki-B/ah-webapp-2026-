const express = require("express");
const router = express.Router();
const InviteController = require("../controllers/invite.controller");

router.get("/", (req, res) => {
  res.json({ message: "It's on invite router" });
});

router.get("/", InviteController.getInviteByToken);
router.post("/accept", InviteController.acceptInvitation);

module.exports = router;
