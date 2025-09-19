  lucide.createIcons();


  
const API_KEY = ""; 
const BASE_URL = "https://api.spoonacular.com/recipes";

const searchInput = document.getElementById("searchInput");
const dietSelect = document.getElementById("dietSelect");
const calorieInput = document.getElementById("calorieInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const cookingDiv = document.getElementById("cookingMode");

let currentSteps = [];
let stepIndex = 0;

// Ingredient-based Search with Diet + Calories
async function searchRecipes() {
  const ingredients = searchInput.value.trim();
  const diet = dietSelect.value;
  const maxCalories = calorieInput.value;

  if (!ingredients) {
    alert("Please enter at least one ingredient.");
    return;
  }

  let url = `${BASE_URL}/complexSearch?query=${ingredients}&addRecipeNutrition=true&number=5&apiKey=${API_KEY}`;

  if (diet) url += `&diet=${diet}`;
  if (maxCalories) url += `&maxCalories=${maxCalories}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    displayRecipes(data.results);
  } catch (err) {
    console.error("Error fetching recipes:", err);
  }
}

//  Display Recipes with Nutrition
function displayRecipes(recipes) {
  resultsDiv.innerHTML = "";

  if (!recipes.length) {
    resultsDiv.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}" />
      <p><b>Calories:</b> ${recipe.nutrition.nutrients[0].amount} kcal</p>
      <p><b>Protein:</b> ${recipe.nutrition.nutrients[8].amount} g</p>
      <button onclick="getSteps(${recipe.id})">Start Cooking</button>
    `;
    resultsDiv.appendChild(card);
  });
}

// Step-by-Step Cooking Mode
async function getSteps(recipeId) {
  try {
    const res = await fetch(`${BASE_URL}/${recipeId}/analyzedInstructions?apiKey=${API_KEY}`);
    const data = await res.json();

    if (!data.length || !data[0].steps.length) {
      alert("No instructions found for this recipe.");
      return;
    }

    currentSteps = data[0].steps.map(step => step.step);
    stepIndex = 0;
    showCookingStep();
  } catch (err) {
    console.error("Error fetching steps:", err);
  }
}

function showCookingStep() {
  cookingDiv.innerHTML = `
    <h2>Step ${stepIndex + 1} of ${currentSteps.length}</h2>
    <p>${currentSteps[stepIndex]}</p>
    <button onclick="prevStep()">⬅ Prev</button>
    <button onclick="nextStep()">Next ➡</button>
    <button onclick="speakStep()">🔊 Speak</button>
  `;
}

function nextStep() {
  if (stepIndex < currentSteps.length - 1) {
    stepIndex++;
    showCookingStep();
  } else {
    cookingDiv.innerHTML = "<h2>✅ You finished cooking! Enjoy your meal!</h2>";
  }
}

function prevStep() {
  if (stepIndex > 0) {
    stepIndex--;
    showCookingStep();
  }
}

function speakStep() {
  const speech = new SpeechSynthesisUtterance(currentSteps[stepIndex]);
  window.speechSynthesis.speak(speech);
}

// Event Listeners
searchBtn.addEventListener("click", searchRecipes);