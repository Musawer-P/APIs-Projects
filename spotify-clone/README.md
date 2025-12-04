Link of the Project - https://spotify-clone-mp.netlify.app/


Spotify Clone

A modern music streaming web app built using HTML, CSS, JavaScript, and the Deezer API.
This project allows users to browse trending songs, search for artists and tracks, and play song previews inside a popup music player.

Features
Trending Songs

Displays the top 8 trending tracks from the Deezer chart API.

Each track shows:

Album cover
Song title
Artist name
Popular Artists

Shows top artists with profile images.

Clicking an artist redirects to their profile page using their ID.

Search Function
Search for:

Tracks
Artists
Results load dynamically without reloading the page.

Music Popup Player
Opens when a song is clicked.

Shows:

Large album cover
Track title
Artist name
Audio preview (30 seconds)
Responsive Design

Fully responsive for:

Mobile
Tablet
Desktop
Uses modern CSS (flexbox/grid) and media queries.

Tech Stack
Technology	Use
HTML5	Structure & layout
CSS3	Styling + Responsive design
JavaScript (Vanilla)	Logic, DOM updates, popup, search system
JSONP	Bypassing CORS for Deezer API
Deezer API	Fetching real songs, artists, albums

API Used
Deezer API (JSONP)
Used endpoints:

https://api.deezer.com/chart/0 — Trending music
https://api.deezer.com/chart/0/artists — Popular artists
https://api.deezer.com/search?q= — Track search
https://api.deezer.com/search/artist?q= — Artist search
All requests use a custom JSONP wrapper to avoid CORS errors.

📂 Project Structure
spotify-clone/
│── index.html
│── artist.html
│── style.css
│── script.js
│── playlist.js
│── README.md
└── assets/

How It Works

1. JSONP Request System
A custom jsonp() function is used to fetch data from the Deezer API.

2. Trending Data Loading
getTrending() loads trending tracks and renders them into .trend-song.

3. Artist Loading
getArtists() loads artists from the chart endpoint.

4. Search System
searchTracks() searches:
First: artists
Then: tracks

5. Popup Player
openPopup(track) opens a full music preview popup.
Responsive Design

Fully optimized for:

Mobile (max-width: 480px)
Tablet (max-width: 900px)
Desktop

Uses:

Grid layout
Flexbox
Clamp for dynamic font sizes