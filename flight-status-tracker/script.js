const flightData = [
  {
    airport: "Dubai International Airport",
    airline: "Emirates",
    flightNumber: "EK202",
    departure: "2025-08-04 14:30",
    arrival: "2025-08-04 18:45"
  },
  {
    airport: "Heathrow Airport",
    airline: "British Airways",
    flightNumber: "BA215",
    departure: "2025-08-04 09:00",
    arrival: "2025-08-04 13:25"
  }
];

const flightContainer = document.getElementById("flight-info");

flightData.forEach(flight => {
  const card = document.createElement("div");
  card.className = "flight-card";
  card.innerHTML = `
    <strong>Airport:</strong> ${flight.airport}<br />
    <strong>Airline:</strong> ${flight.airline}<br />
    <strong>Flight #:</strong> ${flight.flightNumber}<br />
    <strong>Departure:</strong> ${flight.departure}<br />
    <strong>Arrival:</strong> ${flight.arrival}
  `;
  flightContainer.appendChild(card);
});
