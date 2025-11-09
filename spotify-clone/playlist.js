import express from "express";
const router = express.Router();

// Temporary in-memory playlist storage
let playlists = [];

// 🎧 Create a new playlist
router.post("/", (req, res) => {
  const { userId, name } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ message: "❌ Missing userId or name." });
  }

  const newPlaylist = {
    id: playlists.length + 1,
    userId,
    name,
    songs: [],
    createdAt: new Date(),
  };

  playlists.push(newPlaylist);

  res.status(201).json({
    message: "✅ Playlist created successfully!",
    playlist: newPlaylist,
  });
});

// 📜 Get all playlists for a user
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const userPlaylists = playlists.filter((p) => p.userId === userId);

  if (userPlaylists.length === 0) {
    return res.status(404).json({ message: "⚠️ No playlists found for this user." });
  }

  res.json(userPlaylists);
});

// ➕ Add a song to a playlist
router.post("/:playlistId/songs", (req, res) => {
  const { playlistId } = req.params;
  const { song } = req.body;

  const playlist = playlists.find((p) => p.id === Number(playlistId));
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found." });
  }

  if (!song || !song.name || !song.artist) {
    return res.status(400).json({ message: "Song data is incomplete." });
  }

  playlist.songs.push(song);
  res.json({ message: "🎵 Song added successfully.", playlist });
});

// ❌ Delete a playlist
router.delete("/:playlistId", (req, res) => {
  const { playlistId } = req.params;
  const index = playlists.findIndex((p) => p.id === Number(playlistId));

  if (index === -1) {
    return res.status(404).json({ message: "Playlist not found." });
  }

  const deleted = playlists.splice(index, 1);
  res.json({ message: "🗑️ Playlist deleted.", deleted });
});

export default router;
