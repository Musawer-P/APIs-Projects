async function getFlightStatus() {
  const airport = document.getElementById("airport").value.trim().toUpperCase();
  const company = document.getElementById("company").value.trim();
  const flightNum = document.getElementById("flight-number").value.trim().toUpperCase();
  const departure = document.getElementById("departure-time").value;
  const arrival = document.getElementById("arrival-time").value;
  const resultBox = document.getElementById("result");

resultBox.innerHTML = `<div class="loading-box">Loading...</div>`;

  let url = `https://api.aviationstack.com/v1/flights?access_key=e6118a7fd987d1b5bf8274b3b662bc05`;

  if (flightNum) {
    url += `&flight_iata=${flightNum}`;
  }

  if (company) {
    url += `&airline_name=${company}`;
  }

  if (airport) {
    url += `&dep_iata=${airport}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    resultBox.innerHTML = "";

    if (!data.data || data.data.length === 0) {
      resultBox.innerHTML = "No matching flights found.";
      return;
    }

    const flights = data.data.filter(f => {
      let depMatch = true;
      let arrMatch = true;

      if (departure) {
        depMatch = f.departure?.scheduled?.slice(0, 16) === departure;
      }
      if (arrival) {
        arrMatch = f.arrival?.scheduled?.slice(0, 16) === arrival;
      }
      return depMatch && arrMatch;
    });

    if (flights.length === 0) {
      resultBox.innerHTML = "Flights found, but none match the dates.";
      return;
    }

    flights.forEach(flight => {
      const card = document.createElement("div");
      card.className = "flight-card";
      card.innerHTML = `
      <div class = "main-result-div">
      <div class = "first-div">
      <div class = "first-s">
 <strong>Airline:</strong> <span class="flight-info">${flight.airline?.name || "N/A"}</span><br>
  <strong>Flight:</strong> <span class="flight-info">${flight.flight?.iata || "N/A"}</span><br>

  <strong>Status:</strong> 
  <span class="flight-info ${flight.flight_status?.toLowerCase() || "unknown"}">
    ${flight.flight_status || "N/A"}
  </span><br>
</div>

<div class="second-s">
  <strong>From:</strong> <span class="flight-info">${flight.departure?.airport} (${flight.departure?.iata})</span><br>
  <strong>To:</strong> <span class="flight-info">${flight.arrival?.airport} (${flight.arrival?.iata})</span><br>
</div>
</div>

<div class="third-s">
  <strong>Departure:</strong> <span class="flight-info">${flight.departure?.scheduled || "N/A"}</span><br>
  <strong>Arrival:</strong> <span class="flight-info">${flight.arrival?.scheduled || "N/A"}</span><br>
        </div>
        </div>`;
      
      resultBox.appendChild(card);
    });

  } catch (error) {
    resultBox.innerHTML = "Error fetching flight data.";
  }
}
