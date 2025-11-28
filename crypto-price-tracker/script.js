const search = document.getElementById("search");
const currency = document.getElementById("currency");
const rateCoin = document.getElementById("rateCoin");
const rateUSD = document.getElementById("rateUSD");
const percent = document.getElementById("percent");

let chart;

// When user presses Enter
search.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        const coin = search.value.trim().toLowerCase();
        if (coin) loadCoinData(coin);
    }
});

async function loadCoinData(coin) {
    try {
        const url = `https://api.coingecko.com/api/v3/coins/${coin}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            alert("Coin not found!");
            return;
        }

        const name = data.name;
        const price = data.market_data.current_price.usd;
        const change = data.market_data.price_change_percentage_24h.toFixed(2);

        // Update UI
        currency.innerText = name;
        rateCoin.innerText = `1 ${name}`;
        rateUSD.innerText = `${price.toLocaleString()} USD`;
        percent.innerText = `${change}% Today`;
        percent.style.color = change >= 0 ? "limegreen" : "red";

        // Load price chart
        loadChart(coin);

    } catch (err) {
        alert("Error fetching data");
    }
}

async function loadChart(coin) {
    const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=7`;
    const res = await fetch(url);
    const data = await res.json();

    const prices = data.prices.map(p => p[1]);
    const labels = data.prices.map((_, i) => `Day ${i + 1}`);

    const ctx = document.getElementById("myChart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: coin.toUpperCase() + " Price",
                data: prices,
                borderColor: "orange",
                backgroundColor: "rgba(255,165,0,0.2)",
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}


async function loadTrendingCoins() {
    const url = "https://api.coingecko.com/api/v3/search/trending";

    try {
        const res = await fetch(url);
        const data = await res.json();

        const trendingList = document.getElementById("trendingList");
        trendingList.innerHTML = ""; // clear old data

        data.coins.slice(0, 10).forEach(item => {
            const coin = item.item;

            const div = document.createElement("div");
            div.className = "trend-item";

            div.innerHTML = `
                <img src="${coin.thumb}" alt="">
                <span>${coin.name} (${coin.symbol.toUpperCase()})</span>
                <span class="trend-price">$${coin.data.price.toFixed(4)}</span>
            `;

            trendingList.appendChild(div);
        });

    } catch (err) {
        console.log("Error loading trending coins", err);
    }
}

// Load trending coins on page open:
loadTrendingCoins();
