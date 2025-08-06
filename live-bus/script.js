function getMockBusData(busNumber) {
  const speeds = [35, 42, 28, 50, 39];
  const statuses = [
    "Approaching Central Station",
    "Departed Terminal",
    "Stuck in traffic",
    "Running on time",
    "Next stop: Downtown"
  ];
  const etas = [3, 5, 7, 10, 15];

  return {
    number: busNumber,
    speed: speeds[Math.floor(Math.random() * speeds.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    eta: etas[Math.floor(Math.random() * etas.length)]
  };
}

function trackBus() {
  const input = document.getElementById('busInput');
  const info = document.getElementById('busInfo');
  const map = document.getElementById('mapPlaceholder');
  const busNumber = input.value.trim();

  info.innerHTML = '';
  map.textContent = 'Tracking...';

  if (busNumber === '') {
    info.innerHTML = `<p style="color: red;">Please enter a bus number or route.</p>`;
    map.textContent = '[ Map will appear here ]';
    return;
  }

  // Simulate loading delay
  setTimeout(() => {
    const busData = getMockBusData(busNumber);

    map.textContent = `Tracking Bus ${busData.number} on the map...`;

    info.innerHTML = `
      <div class="bus-card">
        <p><strong>Bus #:</strong> ${busData.number}</p>
        <p><strong>Status:</strong> ${busData.status}</p>
        <p><strong>Speed:</strong> ${busData.speed} km/h</p>
        <p><strong>ETA:</strong> ${busData.eta} minutes</p>
      </div>
    `;
  }, 1000); 
}
