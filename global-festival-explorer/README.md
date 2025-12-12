Link of the Project - 
https://frabjous-horse-2113cc.netlify.app/

Project Overview

Global Festival Explorer is a web application that allows users to explore festivals around the world. Users can search for festivals by city and year, and view them on an interactive map. Festival data is fetched from Wikidata using SPARQL queries through a Netlify serverless proxy.

The application includes:
A search interface for city and year.
An interactive Leaflet map displaying festival locations.
A list of festival details including name, location, dates, and links to Wikipedia.

A Netlify serverless function (proxy.js) to handle cross-origin requests to Wikidata.

Features

Search festivals by city and year.
Display festival locations on a map with markers.
Show festival information in a list below the map.
Fetch data dynamically from Wikidata using SPARQL queries.
Serverless proxy function to bypass CORS restrictions.

Folder Structure
Global-Festival-Explorer/
│
├── index.html        # Main HTML file
├── style.css         # CSS styles
├── script.js         # JavaScript functionality
├── netlify.toml      # Netlify configuration
└── functions/
    └── proxy.js      # Netlify serverless function for SPARQL requests

Setup Instructions
Prerequisites
Node.js installed
Netlify CLI installed globally:
npm install -g netlify-cli

Running Locally:

Clone the repository
git clone <repository-url>
cd Global-Festival-Explorer
Start the local Netlify server
netlify dev
Open your browser at:
http://localhost:8888
Test the proxy function directly:
http://localhost:8888/.netlify/functions/proxy?url=https://google.com

You should see Google HTML content, confirming the proxy works.

Deployment Instructions:

Log in to Netlify
netlify login
Deploy the project:
netlify deploy --prod
Your live site URL will be provided by Netlify.

Usage:

Open the website in a browser.
Enter a city (e.g., Tokyo) and year (e.g., 2025) in the search fields.
Click the Search button.
View the festival markers on the map and the festival list below the map.
Click on any marker to see the festival name and location.
Click the Wikipedia link (if available) to read more about a festival.

Technical Details:

Frontend: HTML, CSS, JavaScript, Leaflet.js for interactive maps.
Backend: Netlify Functions (serverless proxy) using Node.js.
Data Source: Wikidata SPARQL endpoint.
CORS Handling: All requests to Wikidata are made through a serverless proxy to avoid cross-origin issues.

Known Issues:

Some SPARQL queries may fail if the city has no festival data in Wikidata for the selected year.
Large queries may sometimes time out or return 502 errors due to Wikidata server limitations.
Map markers depend on available coordinate data; some festivals may not have location information.