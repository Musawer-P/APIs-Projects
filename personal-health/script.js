const API_NINJAS_KEY = "EIQRnY+VmcGplpv2+dDeRA==WPFtNUHVc3udhmq3";

const $ = (s) => document.querySelector(s);
const todayKey = () => new Date().toISOString().slice(0, 10);

const storage = {
  get(k, fallback) {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  },
  set(k, v) {
    localStorage.setItem(k, JSON.stringify(v));
  },
};

const state = {
  user: storage.get("ph_user", { name: "", age: "", height: "", weight: "", gender: "" }),
  totals: storage.get("ph_totals_" + todayKey(), { kcalIn: 0, steps: 0, waterMl: 0 }),
  bmrInfo: storage.get("ph_bmr", null),
};

const nameInput = $("#name");
const ageInput = $("#age");
const heightInput = $("#height");
const weightInput = $("#weight");
const genderSelect = $("#gender");
const infoBtn = $("#info-btn");
const calResultP = document.querySelectorAll("#cal-result-p")[0];
const calResultP2 = document.querySelectorAll("#cal-result-p")[1];
const searchInput = $("#search");
const searchBtn = $("#search-btn");

const healthRows = document.querySelectorAll(".health-tracker-row");
const stepsValueEl = healthRows[0] ? healthRows[0].querySelector("#text") : null;
const waterValueEl = healthRows[1] ? healthRows[1].querySelector("#text") : null;
const caloriesValueEl = healthRows[2] ? healthRows[2].querySelector("#text") : null;
const sleepValueEl = healthRows[3] ? healthRows[3].querySelector("#text") : null;

const apiRows = document.querySelectorAll(".api-search-row");
const foodNameEl = apiRows[0] ? apiRows[0].querySelector("#text") : null;
const proteinEl = apiRows[1] ? apiRows[1].querySelector("#text") : null;
const carbsEl = apiRows[2] ? apiRows[2].querySelector("#text") : null;
const fatEl = apiRows[3] ? apiRows[3].querySelector("#text") : null;

function toast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = "position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0f151d;color:#fff;padding:10px 14px;border-radius:10px;z-index:9999;";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}

function round2(n) { return Math.round(n * 100) / 100; }

function calculateBMI(weightKg, heightCm) {
  const h = heightCm / 100;
  if (!weightKg || !heightCm) return null;
  const bmi = weightKg / (h * h);
  let cat = "";
  if (bmi < 18.5) cat = "Underweight";
  else if (bmi < 25) cat = "Normal";
  else if (bmi < 30) cat = "Overweight";
  else cat = "Obese";
  return { bmi: round2(bmi), category: cat };
}

function calculateBMR({ gender, weightKg, heightCm, age }) {
  if (!weightKg || !heightCm || !age) return null;
  let bmr;
  if (gender === "male") bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  else bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  return Math.round(bmr);
}

function recommendedDailyCalories(bmr, activity = "sedentary") {
  const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
  return Math.round(bmr * (mult[activity] || mult.sedentary));
}

function recommendedWaterMl(weightKg) {
  return Math.round(weightKg * 35);
}

function recommendedSteps(age) {
  age = Number(age) || 30;
  if (age < 18) return 12000;
  if (age <= 40) return 10000;
  if (age <= 60) return 8000;
  return 6000;
}

function recommendedSleepHours(age) {
  age = Number(age) || 30;
  if (age < 1) return "14-17";
  if (age < 3) return "11-14";
  if (age < 6) return "10-13";
  if (age < 13) return "9-11";
  if (age < 18) return "8-10";
  if (age <= 64) return "7-9";
  return "7-8";

}
async function fetchNutritionFood(query) {
  try {
    const res = await fetch("https://api.api-ninjas.com/v1/nutrition?query=" + encodeURIComponent(query), {
      headers: { "X-Api-Key": "EIQRnY+VmcGplpv2+dDeRA==WPFtNUHVc3udhmq3" }
    });
    const data = await res.json();
    if (!data || !data.length) throw new Error("No data");

    const f = data[0]; // first item
    return {
      name: f.name || query,
      kcal: f.calories || 0,
      protein: f.protein_g || 0,
      carbs: f.carbohydrates_total_g || 0,
      fat: f.fat_total_g || 0
    };
  } catch (e) {
    console.warn("Nutrition API error:", e);
    return { name: query, kcal: 0, protein: 0, carbs: 0, fat: 0 };
  }
}

// Clear inputs after save
nameInput.value = "";
ageInput.value = "";
heightInput.value = "";
weightInput.value = "";
genderSelect.value = "";

function updateUIAll() {
  nameInput.value = state.user.name || "";
  ageInput.value = state.user.age || "";
  heightInput.value = state.user.height || "";
  weightInput.value = state.user.weight || "";
  genderSelect.value = state.user.gender || "";

  stepsValueEl && (stepsValueEl.textContent = state.totals.steps || 0);
  waterValueEl && (waterValueEl.textContent = (state.totals.waterMl || 0) + " ml");
  caloriesValueEl && (caloriesValueEl.textContent = Math.round(state.totals.kcalIn || 0));
  sleepValueEl && (sleepValueEl.textContent = recommendedSleepHours(state.user.age));

  const h = Number(state.user.height), w = Number(state.user.weight);
  const bmiRes = calculateBMI(w, h);
  if (bmiRes) {
    calResultP && (calResultP.textContent = `BMI: ${bmiRes.bmi} (${bmiRes.category})`);
    calResultP2 && (calResultP2.textContent = `Recommended water: ${recommendedWaterMl(w)} ml`);
  } else {
    calResultP && (calResultP.textContent = "Fill info and press Submit");
  }

  if (state.bmrInfo) {
    const { bmr, dailyCal } = state.bmrInfo;
    const el = document.getElementById("bmr-info") || document.createElement("div");
    el.id = "bmr-info";
    el.style.marginTop = "8px";
    el.style.fontSize = "13px";
    el.style.color = "#333";
    calResultP.parentNode && calResultP.parentNode.appendChild(el);
    el.textContent = `BMR: ${bmr} kcal • Daily need (sedentary): ${dailyCal} kcal`;
  }
}

function createTrackerControls() {
  if (stepsValueEl) {
    const parent = stepsValueEl.parentNode;
    if (!parent.querySelector(".tracker-controls")) {
      const wrap = document.createElement("div");
      wrap.className = "tracker-controls";
      wrap.style.marginTop = "6px";
      wrap.innerHTML = `<button id="add-steps">+1000</button><button id="reset-steps">Reset</button>`;
      parent.appendChild(wrap);
      wrap.querySelector("#add-steps").addEventListener("click", () => {
        state.totals.steps = (state.totals.steps || 0) + 1000;
        saveTotals(); updateUIAll();
      });
      wrap.querySelector("#reset-steps").addEventListener("click", () => {
        state.totals.steps = 0; saveTotals(); updateUIAll();
      });
    }
  }

  if (waterValueEl) {
    const parent = waterValueEl.parentNode;
    if (!parent.querySelector(".water-controls")) {
      const wrap = document.createElement("div");
      wrap.className = "water-controls";
      wrap.style.marginTop = "6px";
      wrap.innerHTML = `<button id="add-water">+250ml</button><button id="reset-water">Reset</button>`;
      parent.appendChild(wrap);
      wrap.querySelector("#add-water").addEventListener("click", () => {
        state.totals.waterMl = (state.totals.waterMl || 0) + 250;
        if (state.totals.waterMl > 99999) state.totals.waterMl = 99999;
        saveTotals(); updateUIAll();
      });
      wrap.querySelector("#reset-water").addEventListener("click", () => {
        state.totals.waterMl = 0; saveTotals(); updateUIAll();
      });
    }
  }

  if (caloriesValueEl) {
    const parent = caloriesValueEl.parentNode;
    if (!parent.querySelector(".cal-controls")) {
      const wrap = document.createElement("div");
      wrap.className = "cal-controls";
      wrap.style.marginTop = "6px";
      wrap.innerHTML = `<button id="add-cal-100">+100 kcal</button><button id="reset-cal">Reset</button>`;
      parent.appendChild(wrap);
      wrap.querySelector("#add-cal-100").addEventListener("click", () => {
        state.totals.kcalIn = (state.totals.kcalIn || 0) + 100; saveTotals(); updateUIAll();
      });
      wrap.querySelector("#reset-cal").addEventListener("click", () => {
        state.totals.kcalIn = 0; saveTotals(); updateUIAll();
      });
    }
  }
}

function saveUser() { storage.set("ph_user", state.user); }
function saveTotals() { storage.set("ph_totals_" + todayKey(), state.totals); }
function saveBmr() { storage.set("ph_bmr", state.bmrInfo); }

async function handleInfoSubmit() {
  const name = (nameInput.value || "").trim();
  const age = Number(ageInput.value || 0);
  const height = Number(heightInput.value || 0);
  const weight = Number(weightInput.value || 0);
  const gender = genderSelect.value;

  if (!name || !age || !height || !weight || !gender) { toast("Please fill all personal info fields."); return; }

  state.user = { name, age, height, weight, gender };
  saveUser();

  const bmr = calculateBMR({ gender, weightKg: weight, heightCm: height, age });
  const dailyCal = recommendedDailyCalories(bmr, "sedentary");
  state.bmrInfo = { bmr, dailyCal };
  saveBmr();

  toast("Personal info saved.");



  updateUIAll();
}

async function handleFoodSearch() {
  const query = (searchInput.value || "").trim();
  if (!query) { toast("Enter a food to search."); return; }

  foodNameEl && (foodNameEl.textContent = "Searching...");
  proteinEl && (proteinEl.textContent = "-");
  carbsEl && (carbsEl.textContent = "-");
  fatEl && (fatEl.textContent = "-");

const item = await fetchNutritionFood(query); // use the new function here

  foodNameEl && (foodNameEl.textContent = item.name);
proteinEl.textContent = item.kcal != null ? Math.round(item.kcal) + " kcal" : "0 kcal"; // show calories here
carbsEl.textContent = item.carbs != null ? round2(item.carbs) + " g" : "0 g";
fatEl.textContent = item.fat != null ? round2(item.fat) + " g" : "0 g";
  if (item.kcal) {
    state.totals.kcalIn = (state.totals.kcalIn || 0) + Number(item.kcal);
    saveTotals();
    updateUIAll();
    toast(`+${Math.round(item.kcal)} kcal added`);
  }
}

function init() {
  infoBtn && infoBtn.addEventListener("click", handleInfoSubmit);
  searchBtn && searchBtn.addEventListener("click", handleFoodSearch);
  searchInput && searchInput.addEventListener("keyup", (e) => { if (e.key === "Enter") handleFoodSearch(); });
  createTrackerControls();
  updateUIAll();
  console.log("Personal Health initialized for", state.user.name || "Guest");
}

init();



