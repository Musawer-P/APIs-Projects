// routes/playlist.js
import express from "express";
const router = express.Router();

let playlists = []; // temporary in-memory storage

// Create a new playlist
router.post("/", (req, res) => {
  const { userId, name } = req.body;
  if (!userId || !name) return res.status(400).json({ message: "Missing data" });

  const newPlaylist = {
    id: playlists.length + 1,
    userId,
    name,
    songs: [],
  };
  playlists.push(newPlaylist);
  res.status(201).json({ message: "Playlist created", playlist: newPlaylist });
});

// Get all playlists for a user
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const userPlaylists = playlists.filter(p => p.userId === userId);
  res.json(userPlaylists);
});

export default router;
