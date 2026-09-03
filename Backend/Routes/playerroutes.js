const express = require('express');
const router = express.Router();

const playerController = require('../Controllers/playercontroller');
const playerUpload = require('../Middleware/playerupload');

//Get all players
router.get('/',playerController.getAllPlayers);
router.post('/',playerUpload.single('player_img'),playerController.addPlayer);
//Get player by id
router.get('/:id',playerController.getPlayerById);
//Update player by id
router.put('/:id',playerUpload.single('player_img'),playerController.updatePlayer);
//Delete player by id
router.delete('/:id',playerController.deletePlayer);

module.exports = router;

// Client sends POST request
//         │
//         ▼
// POST /api/players
//         │
//         ▼
// playerUpload.single('player_img')
//         │
// Uploads one image
// Stores image in req.file
//         │
//         ▼
// playerController.addPlayer()
//         │
// Reads req.body and req.file
// Saves player in the database
//         │
//         ▼
// Returns response to the client