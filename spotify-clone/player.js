// routes/player.js
import express from "express";
const router = express.Router();

let currentTrack = null;
let isPlaying = false;

// Play a track
router.post("/play", (req, res) => {
  const { songId, title } = req.body;
  if (!songId || !title) return res.status(400).json({ message: "Missing song data" });

  currentTrack = { songId, title };
  isPlaying = true;
  res.json({ message: `Playing: ${title}` });
});

// Pause current track
router.post("/pause", (req, res) => {
  if (!currentTrack) return res.status(400).json({ message: "No track playing" });
  isPlaying = false;
  res.json({ message: `Paused: ${currentTrack.title}` });
});

export default router;
