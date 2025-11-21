Link of the Project - 
https://bus-tracker-mp.netlify.app/

Real-Time Bus Tracker

A simple and fast web app that displays live bus arrival information including route number, destination, expected arrival time, and vehicle ID.

This project uses public transport APIs to fetch real-time bus data and show users exactly when their bus is arriving.

Features:

Search bus line and Station
Live arrival time (Expected time in HH:MM:SS)
Shows bus destination
Displays the actual bus vehicle ID
Fast and lightweight JavaScript
Fully responsive UI

Technologies Used:

HTML5 – Structure
CSS3 – Styling
JavaScript (Fetch API) – To get live data
Public Transport API – Real-time bus arrivals

How It Works:

The user searches for a station Name.
JavaScript sends a fetch() request to the API.

The API returns data with:
Route (Line)
Destination
Expected Arrival Time
VehicleId (bus plate number)

Note:

This project currently works only in the United Kingdom, because the real-time bus data comes from UK public transport APIs (such as Transport for London).
If you search for buses outside the UK, the API will not return results.