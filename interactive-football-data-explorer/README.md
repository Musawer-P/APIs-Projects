Link of the Project - 
https://lucent-chimera-7311b7.netlify.app/


Football Data Explorer

A simple and powerful web app that allows users to search football teams, leagues, and match statistics using the football-data.org API.
This tool helps fans and developers quickly explore football data with a clean UI and smooth functionality.

Features

Search Teams & Leagues
Enter team or league names to fetch real-time data.

Match Details
Displays upcoming fixtures, match results, and standings.

Responsive UI
Works perfectly on desktop, tablet, and mobile.

Uses Football-Data.org API
Reliable football statistics from a trusted service.

Technologies Used

HTML
CSS
JavaScript
Football-Data.org REST API

Open the project folder:

cd football-data-explorer

Open index.html in a browser
No backend required — this is a fully client-side project.

API Key Setup (Very Important)
This project uses football-data.org, which requires an API token.

Create an account at:

https://www.football-data.org/
Get your API token.
Open your script.js file and replace this line with your own key:
const API_KEY = "YOUR_API_KEY_HERE";
Your API will now be active.

How It Works

User enters a team or league name.
JavaScript sends a request to the Football-Data API.
API returns JSON data with team info, matches, standings, etc.
The UI displays results instantly.