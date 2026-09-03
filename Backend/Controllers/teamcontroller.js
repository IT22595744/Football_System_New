const mongoose = require("mongoose");
const Team = require("../Models/team");
const { uploadBufferToS3, deleteFromS3Key, extractKeyFromS3Url } = require("../Config/s3");

// GET /teams
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ teamName: 1 });
    return res.status(200).json({ teams });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch teams" });
  }
};

// POST /teams
const addTeam = async (req, res) => {
  const { teamId, teamName, teamCoach, teamManager } = req.body;

  if (!teamId || !teamName || !teamCoach || !teamManager) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Team flag image is required" });
  }

  let uploaded = null;

  try {
    const existingTeam = await Team.findOne({ teamId: teamId.toUpperCase() });
    if (existingTeam) {
      return res.status(409).json({ message: "Team with this ID already exists" });
    }

    uploaded = await uploadBufferToS3(req.file, "teams/flags");

    const team = new Team({
      teamId: teamId.toUpperCase(),
      teamName,
      flag: uploaded.url,
      flagKey: uploaded.key,
      teamCoach,
      teamManager
    });

    await team.save();
    return res.status(201).json({ message: "Team created successfully", team });
  } catch (err) {
    if (uploaded && uploaded.key) {
      try {
        await deleteFromS3Key(uploaded.key);
      } catch (cleanupErr) {
        console.log("S3 cleanup failed:", cleanupErr);
      }
    }
    console.log(err);
    return res.status(500).json({ message: "Failed to create team" });
  }
};

// GET /teams/:id
const getTeamById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid team ID" });
  }

  try {
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    return res.status(200).json({ team });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch team" });
  }
};

// PUT /teams/:id
const updateTeam = async (req, res) => {
  const id = req.params.id;
  const { teamId, teamName, teamCoach, teamManager } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid team ID" });
  }

  let uploaded = null;

  try {
    if (teamId) {
      const duplicate = await Team.findOne({
        teamId: teamId.toUpperCase(),
        _id: { $ne: id }
      });
      if (duplicate) {
        return res.status(409).json({ message: "Team with this ID already exists" });
      }
    }

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const oldFlagKey = team.flagKey || extractKeyFromS3Url(team.flag);

    if (teamId) team.teamId = teamId.toUpperCase();
    if (teamName) team.teamName = teamName;
    if (teamCoach) team.teamCoach = teamCoach;
    if (teamManager) team.teamManager = teamManager;

    if (req.file) {
      uploaded = await uploadBufferToS3(req.file, "teams/flags");
      team.flag = uploaded.url;
      team.flagKey = uploaded.key;
    }

    const updatedTeam = await team.save();

    if (uploaded && oldFlagKey && oldFlagKey !== uploaded.key) {
      await deleteFromS3Key(oldFlagKey);
    }

    return res.status(200).json({ message: "Team updated successfully", team: updatedTeam });
  } catch (err) {
    if (uploaded && uploaded.key) {
      try {
        await deleteFromS3Key(uploaded.key);
      } catch (cleanupErr) {
        console.log("S3 cleanup failed:", cleanupErr);
      }
    }
    console.log(err);
    return res.status(500).json({ message: "Failed to update team" });
  }
};

// DELETE /teams/:id
const deleteTeam = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid team ID" });
  }

  try {
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const flagKey = team.flagKey || extractKeyFromS3Url(team.flag);
    if (flagKey) {
      await deleteFromS3Key(flagKey);
    }

    await Team.findByIdAndDelete(id);

    return res.status(200).json({ message: "Team deleted successfully", team });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete team" });
  }
};

exports.getAllTeams = getAllTeams;
exports.addTeam = addTeam;
exports.getTeamById = getTeamById;
exports.updateTeam = updateTeam;
exports.deleteTeam = deleteTeam;