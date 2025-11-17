const disasterNameInput = document.getElementById("disaster-name");
const countryInput = document.getElementById("affected-country");
const dateTimeInput = document.getElementById("date-time");
const btn = document.getElementById("btn");

const countryName = document.getElementById("country-name");
const resultDate = document.getElementById("date");
const disasterNameP = document.getElementById("disaster-name-p");
const quantity = document.getElementById("quantity");
const statusText = document.getElementById("status-p");

const newsTitle = document.getElementById("news-p");
const newsDesc = document.getElementById("news-desc");
const newsDate = document.getElementById("news-date");

const footerP = document.getElementById("footer-p-2");

function getLevel(mag) {
    if (mag < 3) return "Low";
    if (mag < 6) return "Medium";
    return "High";
}

async function searchDisaster(country) {
    try {
        const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson");
        const data = await res.json();

        return data.features.find(eq =>
            eq.properties.place.toLowerCase().includes(country.toLowerCase())
        ) || null;

    } catch (err) {
        console.log("Disaster error:", err);
        return null;
    }
}

async function searchNews(disasterName, country) {
    const apiKey = "pub_b36f56b434a644baa095b05d05f7e852";
    const query = `${disasterName} ${country}`;

    try {
        const res = await fetch(
            `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=en`
        );

        const data = await res.json();
        console.log("NewsData:", data);

        if (data.results && data.results.length > 0) {
            return data.results[0];
        }

        return null;

    } catch (err) {
        console.log("News API Error:", err);
        return null;
    }
}

async function loadLatestNews() {
    const apiKey = "pub_b36f56b434a644baa095b05d05f7e852";

    try {
        const res = await fetch(
            `https://newsdata.io/api/1/news?apikey=${apiKey}&language=en&country=us`
        );

        const data = await res.json();

        if (data.results && data.results.length > 0) {
            footerP.innerText = data.results[0].title;
        }

    } catch (err) {
        console.log("Footer news error:", err);
    }
}

loadLatestNews();

btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const disasterName = disasterNameInput.value.trim();
    const country = countryInput.value.trim();
    const dateTime = dateTimeInput.value;

    if (!disasterName || !country) {
        alert("Enter disaster name & country");
        return;
    }

    const eq = await searchDisaster(country);

    if (eq) {
        const mag = eq.properties.mag;
        const place = eq.properties.place;
        const date = new Date(eq.properties.time).toLocaleDateString();

        countryName.innerText = place;
        resultDate.innerText = date;
        disasterNameP.innerText = disasterName;
        quantity.innerText = mag;
        statusText.innerText = getLevel(mag);

    } else {
        countryName.innerText = country;
        resultDate.innerText = dateTime;
        disasterNameP.innerText = disasterName;
        quantity.innerText = "N/A";
        statusText.innerText = "Unknown";
    }

    const news = await searchNews(disasterName, country);

    if (news) {
        newsTitle.innerText = news.title;
        newsDesc.innerText = news.description || "No description";
        newsDate.innerText = news.pubDate;
    } else {
        newsTitle.innerText = "No recent news found";
        newsDesc.innerText = "";
        newsDate.innerText = "";
    }
});
