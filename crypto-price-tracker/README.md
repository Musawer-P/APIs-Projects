Link of the Project - 
https://crypto-price-tracker-mp.netlify.app/


Crypto Price Tracker

A simple and modern web application that allows users to search any cryptocurrency, view live price data, see daily percentage changes, and visualize price movements using interactive charts.
The app also includes a Trending Coins section powered by the CoinGecko API.

Features :

Search Any Coin
Search coins like Bitcoin, Ethereum, Solana, Dogecoin, XRP, BNB, etc.

Shows:

Coin name
1 Coin = Price in USD
24-hour percentage change (color-coded)
Real-Time Price Chart
7-day price history of the selected coin
Line chart powered by Chart.js
Smooth animation
Auto-updates whenever a coin is searched
Trending Coins

Displays top trending coins from CoinGecko - 

Includes:

Coin image
Name
Symbol
Live price
Automatically loads when the page opens

Technologies Used:

HTML5
CSS3
JavaScript (Vanilla JS)
Chart.js
CoinGecko API

API Used:

All data is fetched from the free CoinGecko API, no API key required:

Coin data:
https://api.coingecko.com/api/v3/coins/{coin}

7-day chart data:
https://api.coingecko.com/api/v3/coins/{coin}/market_chart?vs_currency=usd&days=7

Trending coins:
https://api.coingecko.com/api/v3/search/trending