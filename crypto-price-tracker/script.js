 const ctx = document.getElementById('myChart').getContext('2d');

    const myChart = new Chart(ctx, {
      type: 'line', 
      data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // X-axis labels
        datasets: [{
          label: 'Bitcoin',
          data: [12, 19, 3, 5, 2, 3, 7], // Y-axis data
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });


    //Real-Time Portfolio Growth Simulation


     let chart;
    const apiUrl = "https://api.coingecko.com/api/v3/simple/price";

    async function trackInvestment() {
      const coin = document.getElementById("coin").value.toLowerCase();
      const amount = parseFloat(document.getElementById("amount").value);

      if (!coin || !amount) {
        alert("Enter coin name and amount!");
        return;
      }

      // Fetch coin price
      const res = await fetch(`${apiUrl}?ids=${coin}&vs_currencies=usd`);
      const data = await res.json();

      if (!data[coin]) {
        alert("Coin not found!");
        return;
      }

      const price = data[coin].usd;
      const portfolioValue = amount / price * price; // keeps it simple
      const randomOldPrice = price * (0.8 + Math.random() * 0.4); // fake old price
      const changePercent = ((price - randomOldPrice) / randomOldPrice * 100).toFixed(2);

      // Update UI
      document.getElementById("output").style.display = "block";
      document.getElementById("coinName").innerText = coin.toUpperCase();
      document.getElementById("currentPrice").innerText = price.toLocaleString();
      document.getElementById("portfolioValue").innerText = portfolioValue.toLocaleString();
      const changeEl = document.getElementById("change");
      changeEl.innerText = changePercent + "%";
      changeEl.className = changePercent >= 0 ? "profit" : "loss";

      // Chart update
      const ctx = document.getElementById("chart").getContext("2d");
      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Past", "Now"],
          datasets: [{
            label: coin.toUpperCase() + " Growth",
            data: [randomOldPrice, price],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.2)",
            fill: true,
            tension: 0.3
          }]
        },
        options: { responsive: true }
      });
    }