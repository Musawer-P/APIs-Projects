// =======================
// ===== Utilities =======
// =======================
const todayKey = () => new Date().toISOString().slice(0, 10);

const state = {
  totals: storage.get("totals_" + todayKey(), { in: 0, out: 0 }),
  hydration: storage.get("hydration_" + todayKey(), { goal: 2500, consumed: 0 }),
  goals: storage.get("goals", []),
  keys: storage.get("keys", { nutritionixId: "", nutritionixKey: "", wgerToken: "" }),
  remindTimer: null,
  location: { name: "Kabul", lat: 34.5553, lon: 69.2075 },
};

function saveDay() {
  storage.set("totals_" + todayKey(), state.totals);
  storage.set("hydration_" + todayKey(), state.hydration);
}
function saveGoals() {
  storage.set("goals", state.goals);
}
function saveKeys() {
  storage.set("keys", state.keys);
}

function toast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText =
    "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0f151d;border:1px solid rgba(255,255,255,.18);padding:10px 14px;border-radius:12px;z-index:999;color:#e8f0f8;box-shadow:0 8px 30px rgba(0,0,0,.35)";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}

// =======================
// ===== Summary UI ======
// =======================
function renderSummary() {
  $("#kcalIn").textContent = Math.round(state.totals.in);
  $("#kcalOut").textContent = Math.round(state.totals.out);
  const pct = Math.min(
    100,
    Math.round((state.hydration.consumed / Math.max(1, state.hydration.goal)) * 100)
  );
  $("#hydrationKpi").textContent = pct + "%";
}

// ==========================
// ===== Nutrition + Mood ===
// ==========================
async function fetchNutrition(food) {
  const { nutritionixId, nutritionixKey } = state.keys;
  if (nutritionixId && nutritionixKey) {
    try {
      const res = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-id": nutritionixId,
          "x-app-key": nutritionixKey,
        },
        body: JSON.stringify({ query: food }),
      });
      if (!res.ok) throw new Error("Nutritionix error");
      const data = await res.json();

      // Mood & Stress Calendar
      const calendar = document.getElementById("calendar");
      const moodSelect = document.getElementById("mood");
      const saveBtn = document.getElementById("saveMood");
      const tip = document.getElementById("tip");

      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const moods = JSON.parse(localStorage.getItem("moods")) || {};

      function renderCalendar() {
        calendar.innerHTML = "";
        for (let day = 1; day <= daysInMonth; day++) {
          const dayDiv = document.createElement("div");
          dayDiv.classList.add("day");
          dayDiv.textContent = day;
          if (moods[day]) dayDiv.classList.add(moods[day]);
          calendar.appendChild(dayDiv);
        }
      }

      saveBtn.addEventListener("click", () => {
        const mood = moodSelect.value;
        const day = today.getDate();
        moods[day] = mood;
        localStorage.setItem("moods", JSON.stringify(moods));
        renderCalendar();
        checkStress();
      });

      function checkStress() {
        const stressCount = Object.values(moods).filter((m) => m === "stressed").length;
        if (stressCount >= 3) {
          tip.textContent =
            "💡 Tip: You’ve been stressed a lot. Try 5 minutes of deep breathing or a short walk.";
        } else {
          tip.textContent = "";
        }
      }

      renderCalendar();
      checkStress();

      // Map nutrition data
      const items = (data.foods || []).map((f) => ({
        name: f.food_name,
        kcal: f.nf_calories,
        protein: f.nf_protein,
        carbs: f.nf_total_carbohydrate,
        fat: f.nf_total_fat,
        qty: f.serving_qty,
        unit: f.serving_unit,
      }));
      return items.length ? items : estimateNutrition(food);
    } catch (e) {
      console.warn(e);
      return estimateNutrition(food);
    }
  }
  return estimateNutrition(food);
}

function estimateNutrition(food) {
  const f = food.toLowerCase();
  const table = [
    { k: ["apple", "banana", "fruit"], kcal: 95, p: 0.5, c: 25, fat: 0.3 },
    { k: ["rice", "biryani", "pilaf", "kabuli"], kcal: 250, p: 5, c: 52, fat: 2 },
    { k: ["chicken", "kebab", "shawarma"], kcal: 300, p: 28, c: 2, fat: 18 },
    { k: ["bread", "naan"], kcal: 160, p: 5, c: 30, fat: 1.5 },
    { k: ["egg"], kcal: 78, p: 6, c: 0.6, fat: 5 },
    { k: ["salad", "vegetable"], kcal: 90, p: 3, c: 12, fat: 3 },
  ];
  const hit =
    table.find((x) => x.k.some((w) => f.includes(w))) || {
      kcal: 220,
      p: 8,
      c: 28,
      fat: 8,
    };
  return [
    { name: food, kcal: hit.kcal, protein: hit.p, carbs: hit.c, fat: hit.fat, qty: 1, unit: "serving" },
  ];
}

init();

// ==============================
// ===== Features Section =======
// ==============================

/***********************************
 * // one – AI-Powered Smart Meal Planner
 ***********************************/
async function getMealPlan(calories = 2000) {
  const API_KEY = "YOUR_SPOONACULAR_KEY"; // Replace with your Spoonacular API key
  const url = `https://api.spoonacular.com/mealplanner/generate?timeFrame=day&targetCalories=${calories}&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Meal Plan:", data);
    data.meals.forEach((meal) => {
      console.log(`${meal.title} - Ready in ${meal.readyInMinutes} mins`);
    });
  } catch (err) {
    console.error("Meal Planner Error:", err);
  }
}
// Example: getMealPlan(2200);

/***********************************
 * // two – Real-Time Hydration Tracker
 ***********************************/
function HydrationTracker() {
  const DAILY_GOAL = 2000; // ml
  let current = parseInt(localStorage.getItem("waterIntake")) || 0;

  function addWater(amount) {
    current += amount;
    if (current > DAILY_GOAL) current = DAILY_GOAL;
    localStorage.setItem("waterIntake", current);
    updateUI();
  }

  function updateUI() {
    const percent = Math.round((current / DAILY_GOAL) * 100);
    console.log(`Hydration: ${current}ml / ${DAILY_GOAL}ml (${percent}%)`);
    // UI: Update your water bottle animation here
  }

  return { addWater, updateUI };
}

const tracker = HydrationTracker();
tracker.updateUI();
// Example: tracker.addWater(250);

/***********************************
 * // three – Live Fitness & Heartbeat Dashboard
 ***********************************/
function LiveFitnessDashboard() {
  let heartRate = 70; // bpm
  let steps = 0;

  function simulate() {
    heartRate = 60 + Math.floor(Math.random() * 40); // 60–100 bpm
    steps += Math.floor(Math.random() * 10); // simulate step increase
    const stressLevel = heartRate > 90 ? "High" : "Normal";

    console.log(`❤️ Heartbeat: ${heartRate} bpm`);
    console.log(`👟 Steps: ${steps}`);
    console.log(`⚡ Stress Level: ${stressLevel}`);
  }

  setInterval(simulate, 5000);
}

LiveFitnessDashboard();
