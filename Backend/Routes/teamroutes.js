const express = require("express");
const router = express.Router();

const TeamController = require("../Controllers/teamcontroller");
const upload = require("../Middleware/teamupload");

router.get("/", TeamController.getAllTeams);
router.post("/", upload.single("flag"), TeamController.addTeam);
router.get("/:id", TeamController.getTeamById);
router.put("/:id", upload.single("flag"), TeamController.updateTeam);
router.delete("/:id", TeamController.deleteTeam);

module.exports = router;