const mongoose = require('mongoose');
const Player = require('../Models/player');
const {
  uploadBufferToS3,
  deleteFromS3Key,
  extractKeyFromS3Url
} = require('../Config/s3');

/**
 * GET /players
 * Return all players (most recent first)
 */
const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    // return as object for consistent client handling
    return res.status(200).json({ players });
  } catch (err) {
    console.error('getAllPlayers error:', err);
    return res.status(500).json({ message: 'Failed to fetch players' });
  }
};

/**
 * POST /players
 * Expects multipart/form-data with a file field 'player_img'
 * body: { name, team_name, jersey_no, position }
 */
const addPlayer = async (req, res) => {
  const { name, team_name, jersey_no, position } = req.body;

  if (!name || !team_name || !jersey_no || !position) {
    return res.status(400).json({ message: 'name, team_name, jersey_no and position are required' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Player image is required' });
  }

  let uploaded = null;

  try {
    // Upload to S3 under players/images
    uploaded = await uploadBufferToS3(req.file, 'players/images');

    const player = new Player({
      name: name.trim(),
      team_name: team_name.trim(),
      jersey_no: Number(jersey_no),
      position: position.trim(),
      player_img: uploaded.url,
      player_img_key: uploaded.key
    });

    await player.save();

    return res.status(201).json({ message: 'Player created successfully', player });
  } catch (err) {
    console.error('addPlayer error:', err);
    // cleanup if upload succeeded but DB save failed
    if (uploaded && uploaded.key) {
      try {
        await deleteFromS3Key(uploaded.key);
      } catch (cleanupErr) {
        console.error('Failed to cleanup S3 after addPlayer failure:', cleanupErr);
      }
    }
    return res.status(500).json({ message: 'Failed to create player' });
  }
};

/**
 * GET /players/:id
 */
const getPlayerById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid player id' });
  }

  try {
    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    return res.status(200).json({ player });
  } catch (err) {
    console.error('getPlayerById error:', err);
    return res.status(500).json({ message: 'Failed to fetch player' });
  }
};

/**
 * PUT /players/:id
 * Accepts optional file 'player_img' (multipart/form-data)
 * body may contain { name, team_name, jersey_no, position }
 */
const updatePlayer = async (req, res) => {
  const id = req.params.id;
  const { name, team_name, jersey_no, position } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid player id' });
  }

  let uploaded = null;

  try {
    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    // capture old key for cleanup if we replace image
    const oldKey = player.player_img_key || extractKeyFromS3Url(player.player_img);

    if (name) player.name = name.trim();
    if (team_name) player.team_name = team_name.trim();
    if (jersey_no) player.jersey_no = Number(jersey_no);
    if (position) player.position = position.trim();

    if (req.file) {
      // upload new image
      uploaded = await uploadBufferToS3(req.file, 'players/images');
      player.player_img = uploaded.url;
      player.player_img_key = uploaded.key;
    }

    const updatedPlayer = await player.save();

    // if new image uploaded successfully, delete old one (but only if different)
    if (uploaded && oldKey && oldKey !== uploaded.key) {
      try {
        await deleteFromS3Key(oldKey);
      } catch (cleanupErr) {
        console.error('Failed to delete old player image from S3:', cleanupErr);
        // not fatal for client response
      }
    }

    return res.status(200).json({ message: 'Player updated successfully', player: updatedPlayer });
  } catch (err) {
    console.error('updatePlayer error:', err);
    // cleanup newly uploaded file if DB save failed
    if (uploaded && uploaded.key) {
      try {
        await deleteFromS3Key(uploaded.key);
      } catch (cleanupErr) {
        console.error('Failed to cleanup S3 after updatePlayer failure:', cleanupErr);
      }
    }
    return res.status(500).json({ message: 'Failed to update player' });
  }
};

/**
 * DELETE /players/:id
 */
const deletePlayer = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid player id' });
  }

  try {
    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    const key = player.player_img_key || extractKeyFromS3Url(player.player_img);
    if (key) {
      try {
        await deleteFromS3Key(key);
      } catch (s3Err) {
        console.error('Failed to delete player image from S3 during player deletion:', s3Err);
        // continue to delete DB record even if S3 deletion fails
      }
    }

    await Player.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Player deleted successfully', player });
  } catch (err) {
    console.error('deletePlayer error:', err);
    return res.status(500).json({ message: 'Failed to delete player' });
  }
};

module.exports = {
  getAllPlayers,
  addPlayer,
  getPlayerById,
  updatePlayer,
  deletePlayer
};