// ======================================
//   METEORA — app.js
//   Open-Meteo Geocoding + Forecast API
// ======================================

// --- Referências ao DOM ---
const searchInput    = document.getElementById('search-input');
const searchBtn      = document.getElementById('search-btn');
const errorMsg       = document.getElementById('error-msg');
const loadingOverlay = document.getElementById('loading-overlay');
const welcomeState   = document.getElementById('welcome-state');
const weatherContent = document.getElementById('weather-content');
const catImg         = document.getElementById('cat-img');

// --- URLs base das APIs ---
const GEO_API_URL      = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

// ======================================
//   MODO ESCURO AUTOMÁTICO POR HORA
//   Noturno: 19h–6h
// ======================================

function applyDarkMode() {
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 6;
  document.body.classList.toggle('dark', isNight);
}

// ======================================
//   DEGRADÊS POR CONDIÇÃO CLIMÁTICA
//   Cada condição tem paleta claro + escuro
// ======================================

const GRADIENTS = {
  sunny: {
    light: ['#FFE29A', '#FF9F6B'],
    dark:  ['#5A3A14', '#241407'],
  },
  rainy: {
    light: ['#9FC4E8', '#6B92C4'],
    dark:  ['#13243F', '#080F1E'],
  },
  snowy: {
    light: ['#EAF6FC', '#C7E4F2'],
    dark:  ['#22323F', '#0F1A22'],
  },
  windy: {
    light: ['#D6E8DC', '#A9CFC0'],
    dark:  ['#16241E', '#0A130F'],
  },
};

function applyGradient(condition) {
  const isDark = document.body.classList.contains('dark');
  const palette = GRADIENTS[condition] ?? GRADIENTS.windy;
  const [start, end] = isDark ? palette.dark : palette.light;

  document.documentElement.style.setProperty('--grad-start', start);
  document.documentElement.style.setProperty('--grad-end', end);
}

// ======================================
//   MAPEAMENTO WMO → CONDIÇÃO VISUAL
// ======================================

function getCondition(wmoCode) {
  if ([71, 73, 75, 77, 85, 86].includes(wmoCode))                        return 'snowy';
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(wmoCode)) return 'rainy';
  if ([0, 1].includes(wmoCode))                                          return 'sunny';
  return 'windy';
}

// ======================================
//   DESCRIÇÕES E EMOJIS WMO
// ======================================

const WMO_DESCRIPTIONS = {
  0: 'Céu limpo', 1: 'Principalmente limpo',
  2: 'Parcialmente nublado', 3: 'Nublado',
  45: 'Nevoeiro', 48: 'Nevoeiro com geada',
  51: 'Garoa leve', 53: 'Garoa moderada', 55: 'Garoa intensa',
  56: 'Garoa congelante leve', 57: 'Garoa congelante intensa',
  61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte',
  66: 'Chuva congelante leve', 67: 'Chuva congelante forte',
  71: 'Neve leve', 73: 'Neve moderada', 75: 'Neve forte', 77: 'Granizo',
  80: 'Pancadas leves', 81: 'Pancadas moderadas', 82: 'Pancadas violentas',
  85: 'Pancadas de neve leves', 86: 'Pancadas de neve fortes',
  95: 'Trovoada', 96: 'Trovoada com granizo', 99: 'Trovoada com granizo forte',
};

const WMO_EMOJI = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌧️', 56: '🌧️', 57: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️', 66: '🌨️', 67: '🌨️',
  71: '❄️', 73: '❄️', 75: '❄️', 77: '🌨️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  85: '🌨️', 86: '🌨️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
};

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// ======================================
//   ETAPA 1: Geocodificação
// ======================================

async function fetchCoordinates(cityName) {
  const url = `${GEO_API_URL}?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`;
  const response = await fetch(url);

  if (!response.ok) throw new Error('Falha na comunicação com a API.');

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('Cidade não encontrada. Tente outro nome! 🐾');
  }

  const { latitude, longitude, name, country } = data.results[0];
  return { latitude, longitude, name, country };
}

// ======================================
//   ETAPA 2: Previsão do tempo
// ======================================

async function fetchForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,weather_code',
    hourly:  'temperature_2m,precipitation_probability,weather_code',
    daily:   'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: 7,
  });

  const response = await fetch(`${FORECAST_API_URL}?${params}`);
  if (!response.ok) throw new Error('Falha ao obter dados de previsão.');
  return await response.json();
}

// ======================================
//   ATUALIZAR DOM — hero card
// ======================================

function updateHeroCard(city, country, current) {
  const wmoCode   = current.weather_code;
  const condition = getCondition(wmoCode);

  document.getElementById('city-name').textContent    = city;
  document.getElementById('country-name').textContent = country || '';
  document.getElementById('temp-main').textContent    = `${Math.round(current.temperature_2m)}°`;
  document.getElementById('temp-feels').textContent   = `${Math.round(current.apparent_temperature)}°`;
  document.getElementById('stat-humidity').textContent = `${current.relative_humidity_2m}%`;
  document.getElementById('stat-rain').textContent    = `${current.precipitation_probability ?? 0}%`;
  document.getElementById('weather-desc').textContent = WMO_DESCRIPTIONS[wmoCode] ?? 'Condição desconhecida';

  // Imagem do gatinho PNG correspondente ao clima
  catImg.src = `${condition}.png`;
  catImg.classList.remove('hidden');

  // Degradê de fundo correspondente
  applyGradient(condition);
}

// ======================================
//   ATUALIZAR DOM — próximas horas
// ======================================

function updateHourly(hourlyData) {
  const container = document.getElementById('hourly-scroll');
  container.innerHTML = '';

  const now   = new Date();
  const times = hourlyData.time;
  let count   = 0;

  for (let i = 0; i < times.length && count < 24; i++) {
    const itemDate = new Date(times[i]);
    if (itemDate < now && itemDate.getHours() !== now.getHours()) continue;

    const hour      = itemDate.getHours().toString().padStart(2, '0') + 'h';
    const temp      = Math.round(hourlyData.temperature_2m[i]);
    const rain      = hourlyData.precipitation_probability[i] ?? 0;
    const emoji     = WMO_EMOJI[hourlyData.weather_code[i]] ?? '🌡️';
    const isCurrent = count === 0;

    const item = document.createElement('div');
    item.className = `hourly-item${isCurrent ? ' current-hour' : ''}`;
    item.innerHTML = `
      <span class="hourly-time">${isCurrent ? 'Agora' : hour}</span>
      <span class="hourly-icon">${emoji}</span>
      <span class="hourly-temp">${temp}°</span>
      <span class="hourly-rain">💧 ${rain}%</span>
    `;
    container.appendChild(item);
    count++;
  }
}

// ======================================
//   ATUALIZAR DOM — próximos 7 dias
// ======================================

function updateWeekly(dailyData) {
  const container = document.getElementById('weekly-list');
  container.innerHTML = '';

  dailyData.time.forEach((dateStr, i) => {
    const date    = new Date(dateStr + 'T12:00:00');
    const dayName = i === 0 ? 'Hoje' : WEEKDAYS[date.getDay()];
    const emoji   = WMO_EMOJI[dailyData.weather_code[i]] ?? '🌡️';
    const max     = Math.round(dailyData.temperature_2m_max[i]);
    const min     = Math.round(dailyData.temperature_2m_min[i]);
    const rain    = dailyData.precipitation_probability_max[i] ?? 0;

    const item = document.createElement('div');
    item.className = 'weekly-item';
    item.innerHTML = `
      <span class="weekly-day">${dayName}</span>
      <span class="weekly-icon">${emoji}</span>
      <span class="weekly-rain">💧 ${rain}%</span>
      <div class="weekly-temps">
        <span class="weekly-max">${max}°</span>
        <span class="weekly-min">${min}°</span>
      </div>
    `;
    container.appendChild(item);
  });
}

// ======================================
//   FUNÇÃO PRINCIPAL
// ======================================

async function searchWeather() {
  const cityName = searchInput.value.trim();
  if (!cityName) return;

  setError('');
  showLoading(true);

  try {
    const { latitude, longitude, name, country } = await fetchCoordinates(cityName);
    const forecastData = await fetchForecast(latitude, longitude);

    updateHeroCard(name, country, forecastData.current);
    updateHourly(forecastData.hourly);
    updateWeekly(forecastData.daily);

    welcomeState.classList.add('hidden');
    weatherContent.classList.remove('hidden');
  } catch (err) {
    setError(err.message ?? 'Algo deu errado. Tente novamente!');
  } finally {
    showLoading(false);
  }
}

// ======================================
//   HELPERS
// ======================================

function setError(msg)         { errorMsg.textContent = msg; }
function showLoading(visible)  { loadingOverlay.classList.toggle('hidden', !visible); }

// ======================================
//   INICIALIZAÇÃO
// ======================================

applyDarkMode();

searchBtn.addEventListener('click', searchWeather);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchWeather();
});