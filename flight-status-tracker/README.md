Link of the Project - 
https://flight-tracker-mp.netlify.app/

Flight Tracker App:

The Flight Tracker App allows users to check real-time flight status by entering airport, airline/company name, flight number, and optional departure and arrival times. The app fetches live data from the AviationStack API and displays it in a responsive, user-friendly interface.

Features:

Search flights by:
Airport IATA code
Airline/company name
Flight number (IATA code)
Optional departure & arrival dates
Real-time flight status: Active, Scheduled, Landed, Delayed, Cancelled
Responsive design: Works on mobile, tablet, and desktop
Cards layout with clean, readable design
Color-coded flight status for quick reference

Technologies Used:

HTML5 & CSS3 – for markup and styling
JavaScript (ES6) – for fetching and displaying flight data
AviationStack API – for real-time flight information
Flexbox/Grid – for responsive layout

Usage Instructions:

Enter the airport IATA code (e.g., DXB, LHR).
Enter the airline/company name (e.g., Emirates, FlyDubai).
Enter the flight number (e.g., EK202, FZ201).
Optionally, select departure and arrival dates.
Click Check Status.

View flight results displayed as cards:

Airline Name
Flight Number
Departure & Arrival Airports
Departure & Arrival Times
Flight Status (color-coded)
Styling & Layout

Flight Cards:
Each flight is displayed in a responsive card layout using CSS Grid.

Responsive Typography:
Font sizes use clamp() for smooth scaling across mobile, tablet, and desktop.

API Notes:

Use IATA codes for airports and flight numbers for accurate results.
Partial airline names work (e.g., "Emirates").
API key required for fetching live flight data.