// server.js
import express from "express";
import playlistRoutes from "./routes/playlist.js";
import playerRoutes from "./routes/player.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/playlists", playlistRoutes);
app.use("/api/player", playerRoutes);

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🎧 Spotify Clone API running on port ${PORT}`));
