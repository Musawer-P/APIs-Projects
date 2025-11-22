lucide.createIcons();

const API_KEY = "651b3fbd780947c29336458e593e944a"; 
const BASE_URL = "https://api.spoonacular.com/recipes/complexSearch";

const searchInput = document.getElementById("search");
const titleEl = document.querySelector(".main h2");
const descEl = document.querySelector(".desc p");
const timeEl = document.getElementById("time");
const caloriesEl = document.getElementById("calories");

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchRecipe();
    }
});

async function searchRecipe() {
    const query = searchInput.value.trim();
    if (!query) return;

    const url = `${BASE_URL}?query=${query}&addRecipeInformation=true&addRecipeNutrition=true&number=1&apiKey=${API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.results.length) {
            titleEl.textContent = "Not Found";
            descEl.textContent = "No recipe found. Try something else.";
            timeEl.textContent = "--";
            caloriesEl.textContent = "--";
            return;
        }

        const recipe = data.results[0];

        titleEl.textContent = recipe.title;
        descEl.textContent = recipe.summary.replace(/<[^>]*>?/gm, "").slice(0, 150) + "...";
        timeEl.textContent = recipe.readyInMinutes + " Min";
        caloriesEl.textContent = recipe.nutrition.nutrients[0].amount + " Calories";

    } catch (err) {
        console.error(err);
        titleEl.textContent = "Error";
        descEl.textContent = "Something went wrong.";
    }
}
