async function getFlightStatus() {
  const flight = document.getElementById('flightInput').value.trim().toUpperCase();
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = 'Loading...';

  if (!flight) {
    resultDiv.innerHTML = '⚠️ Please enter a valid flight number.';
    return;
  }

  try {
    const apiKey = '';
    const response = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flight}`);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      resultDiv.innerHTML = '❌ No data found for this flight.';
      return;
    }

    const flightInfo = data.data[0];
    const { airline, flight_status, departure, arrival } = flightInfo;

    resultDiv.innerHTML = `
      <strong>Airline:</strong> ${airline.name}<br/>
      <strong>Status:</strong> ${flight_status}<br/>
      <strong>From:</strong> ${departure.airport} at ${departure.scheduled}<br/>
      <strong>To:</strong> ${arrival.airport} at ${arrival.scheduled}<br/>
      <strong>Gate:</strong> ${departure.gate || 'N/A'} → ${arrival.gate || 'N/A'}
    `;
  } catch (error) {
    resultDiv.innerHTML = '🚫 Error fetching flight data.';
    console.error(error);
  }
}
