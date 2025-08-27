// ===== Utilities =====
const todayKey = () => new Date().toISOString().slice(0,10);

const state = {
totals: storage.get('totals_'+todayKey(), { in: 0, out: 0 }),
hydration: storage.get('hydration_'+todayKey(), { goal: 2500, consumed: 0 }),
goals: storage.get('goals', []),
keys: storage.get('keys', { nutritionixId: '', nutritionixKey: '', wgerToken: '' }),
remindTimer: null,
location: { name: 'Kabul', lat: 34.5553, lon: 69.2075 },
};


function saveDay() { storage.set('totals_'+todayKey(), state.totals); storage.set('hydration_'+todayKey(), state.hydration); }
function saveGoals() { storage.set('goals', state.goals); }
function saveKeys() { storage.set('keys', state.keys); }


function toast(msg) {
const t = document.createElement('div');
t.textContent = msg;
t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0f151d;border:1px solid rgba(255,255,255,.18);padding:10px 14px;border-radius:12px;z-index:999;color:#e8f0f8;box-shadow:0 8px 30px rgba(0,0,0,.35)';
document.body.appendChild(t);
setTimeout(()=>t.remove(), 1800);
}


// ===== Summary UI =====
function renderSummary(){
$('#kcalIn').textContent = Math.round(state.totals.in);
$('#kcalOut').textContent = Math.round(state.totals.out);
const pct = Math.min(100, Math.round((state.hydration.consumed / Math.max(1, state.hydration.goal)) * 100));
$('#hydrationKpi').textContent = pct + '%';
}


// ===== Nutrition =====
async function fetchNutrition(food){
const { nutritionixId, nutritionixKey } = state.keys;
if(nutritionixId && nutritionixKey){
try{
const res = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-app-id': nutritionixId,
'x-app-key': nutritionixKey
},
body: JSON.stringify({ query: food })
});
if(!res.ok) throw new Error('Nutritionix error');
const data = await res.json();
// Map to our format
const items = (data.foods||[]).map(f => ({
name: f.food_name,
kcal: f.nf_calories,
protein: f.nf_protein,
carbs: f.nf_total_carbohydrate,
fat: f.nf_total_fat,
qty: f.serving_qty,
unit: f.serving_unit
}));
return items.length ? items : estimateNutrition(food);
}catch(e){ console.warn(e); return estimateNutrition(food); }
}
// fallback if no keys
return estimateNutrition(food);
}


function estimateNutrition(food){
// ultra-simple heuristic fallback using keywords
const f = food.toLowerCase();
const table = [
{ k: ['apple','banana','fruit'], kcal: 95, p: 0.5, c: 25, fat: 0.3 },
{ k: ['rice','biryani','pilaf','kabuli'], kcal: 250, p: 5, c: 52, fat: 2 },
{ k: ['chicken','kebab','kebab','shawarma'], kcal: 300, p: 28, c: 2, fat: 18 },
{ k: ['bread','naan'], kcal: 160, p: 5, c: 30, fat: 1.5 },
{ k: ['egg'], kcal: 78, p: 6, c: 0.6, fat: 5 },
{ k: ['salad','vegetable'], kcal: 90, p: 3, c: 12, fat: 3 }
];
const hit = table.find(x => x.k.some(w => f.includes(w)) ) || { kcal: 220, p: 8, c: 28, fat: 8 };
return [{ name: food, kcal: hit.kcal, protein: hit.p, carbs: hit.c, fat: hit.fat, qty: 1, unit: 'serving' }];
}
init();