const searchInput = document.getElementById("search");
const countrySelect = document.getElementById("country");
const searchBtn = document.getElementById("submit");

const flagImg = document.querySelector(".flag img");
const nameEl = document.getElementById("name");
const capitalEl = document.getElementById("capital");
const populationEl = document.querySelector(".population p");
const areaEl = document.querySelector(".area p");
const currencyEl = document.getElementById("currency");
const timeEl = document.getElementById("time");
const languageEl = document.getElementById("language");

async function fetchCountryData(country) {
  if (!country) {
    alert("Please enter or select a country!");
    return;
  }

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if (!res.ok) throw new Error("Country not found");

    const data = await res.json();
    const c = data[0];

    flagImg.src = c.flags.png;
    nameEl.textContent = c.name.common;
    capitalEl.textContent = c.capital?.[0] || "N/A";
    populationEl.textContent = `${c.population.toLocaleString()} people`;
    areaEl.textContent = `${c.area.toLocaleString()} km²`;

    // Currency
    currencyEl.textContent = Object.values(c.currencies || {})
      .map(cur => `${cur.name} (${cur.symbol})`)
      .join(", ") || "N/A";

    // Timezone
    timeEl.textContent = c.timezones.join(", ");

    // Language
    languageEl.textContent = Object.values(c.languages || {}).join(", ") || "N/A";

  } catch (error) {
    alert("Country not found. Please try again.");
    console.error(error);
  }
}

// Search button click
searchBtn.addEventListener("click", () => {
  const country = searchInput.value.trim() || countrySelect.value;
  fetchCountryData(country);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchCountryData(searchInput.value.trim());
  }
});

countrySelect.addEventListener("change", () => {
  const country = countrySelect.value;
  if (country) fetchCountryData(country);
});
