Link of the Project 
https://global-disaster-mp.netlify.app/

Global Disaster & News Tracker:

A web application that allows users to search for natural disasters (like earthquakes) by country and date, view live disaster information, and fetch relevant news and latest updates using NewsData.io API.

Features:

Search Disaster Data 
Fetch live earthquake data from the USGS API including:

Affected country/location
Date of occurrence
Magnitude
Disaster severity (Low / Medium / High)
Fetch Relevant News
Get the latest news related to the disaster and affected country using the NewsData.io API.
News title
Description
Published date
Link to the full article

Latest News Section
Displays the most recent world news automatically in the footer using the NewsData.io API.

User-Friendly Interface
Clean and simple UI with separate sections for disaster information, news, and latest headlines.


APIs Used:

USGS Earthquake API

Endpoint: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
Provides live earthquake data including magnitude, location, and timestamp.

NewsData.io API
Endpoint: https://newsdata.io/api/1/news

Fetches news articles related to disasters and countries.

How It Works:

User enters:
Disaster Name (e.g., earthquake)
Country
Date
Clicks Submit.

App fetches live disaster info from USGS API.
App fetches relevant news using NewsData.io API.
Results are displayed in separate sections for disaster info and news.
Latest world news automatically updates in the footer.