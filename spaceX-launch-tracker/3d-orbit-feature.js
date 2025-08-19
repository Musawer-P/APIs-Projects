// ===== Utilities =====
const $ = (id)=>document.getElementById(id);
const fmt = (d)=> new Date(d).toLocaleString(undefined, {dateStyle:'medium', timeStyle:'short'});
function pad(n){return String(n).padStart(2,'0')}
function msToHMS(ms){
if(ms <= 0) return '00:00:00';
const s = Math.floor(ms/1000);
const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}


// ===== SpaceX API fetch & mapping =====
async function fetchUpcomingAndRecent(){
const [upcoming, past] = await Promise.all([
fetch('https://api.spacexdata.com/v4/launches/upcoming').then(r=>r.json()),
fetch('https://api.spacexdata.com/v4/launches/past').then(r=>r.json())
]);
// sort upcoming by soonest, and take some recent past for demo
upcoming.sort((a,b)=> new Date(a.date_utc)-new Date(b.date_utc));
past.sort((a,b)=> new Date(b.date_utc)-new Date(a.date_utc));
const recentPast = past.slice(0,8);
return [...upcoming, ...recentPast];
}


async function hydrateLaunch(launch){
// get rocket, launchpad, payloads
const [rocket, pad] = await Promise.all([
fetch(`https://api.spacexdata.com/v4/rockets/${launch.rocket}`).then(r=>r.json()),
fetch(`https://api.spacexdata.com/v4/launchpads/${launch.launchpad}`).then(r=>r.json())
]);
let orbit = '—', inclination=null;
if(launch.payloads && launch.payloads.length){
try{
const p = await fetch(`https://api.spacexdata.com/v4/payloads/${launch.payloads[0]}`).then(r=>r.json());
orbit = p.orbit || '—';
if(typeof p.inclination_deg === 'number') inclination = p.inclination_deg;
}catch(e){/* ignore */}
}
return { launch, rocket, pad, orbit, inclination };
}


// ===== 3D Scene =====
main();