// Basic list of cities with UTC offsets (not daylight saving aware, but works for demo)
const allCities = {
  "Rome": 2, "London": 1, "New York": -4, "Tokyo": 9, "Berlin": 2, "Los Angeles": -7,
  "Sydney": 10, "Moscow": 3, "Beijing": 8, "Dubai": 4, "Sao Paulo": -3, "Cairo": 2, "Paris": 2
};
let cities = JSON.parse(localStorage.getItem('tzb_cities')||'["Rome","London","New York"]');

function saveCities() {
  localStorage.setItem('tzb_cities', JSON.stringify(cities));
}
function addCity() {
  const input = document.getElementById('cityInput');
  const city = input.value.trim();
  if (allCities[city] && !cities.includes(city)) {
    cities.push(city);
    saveCities();
    renderCities();
    renderSelects();
  } else if (!allCities[city]) {
    alert('City not found. Try another (case-sensitive, e.g. "Tokyo").');
  }
  input.value = '';
}
function delCity(city) {
  cities = cities.filter(c => c !== city);
  saveCities();
  renderCities();
  renderSelects();
}
function renderCities() {
  const now = new Date();
  document.getElementById('cityList').innerHTML = cities.map(city => {
    const utc = now.getUTCHours() + allCities[city];
    const h = ((utc+24)%24).toString().padStart(2, '0');
    const m = now.getUTCMinutes().toString().padStart(2, '0');
    return `<div class="city-row">
      <b>${city}</b>: ${h}:${m}
      <button onclick="delCity('${city}')">Delete</button>
    </div>`;
  }).join('');
}
function renderSelects() {
  const opts = cities.map(c => `<option>${c}</option>`).join('');
  document.getElementById('fromCity').innerHTML = opts;
  document.getElementById('toCity').innerHTML = opts;
}
function convertTime() {
  const from = document.getElementById('fromCity').value;
  const to = document.getElementById('toCity').value;
  const time = document.getElementById('fromTime').value;
  if (!from || !to || !time) return;
  const [fh,fm] = time.split(':').map(Number);
  const diff = allCities[to] - allCities[from];
  let th = (fh + diff + 24) % 24;
  document.getElementById('toTime').textContent = th.toString().padStart(2,'0') + ':' + fm.toString().padStart(2,'0');
}
function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('tzb_theme', document.body.classList.contains('dark') ? 'dark' : '');
}
window.onload = () => {
  if (localStorage.getItem('tzb_theme') === 'dark') document.body.classList.add('dark');
  renderCities();
  renderSelects();
  document.getElementById('fromCity').onchange = convertTime;
  document.getElementById('toCity').onchange = convertTime;
  document.getElementById('fromTime').oninput = convertTime;
  setInterval(renderCities, 20000); // update every 20s
};
