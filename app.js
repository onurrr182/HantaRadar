/**
 * HANTARADAR — Core Application Logic
 * Live hantavirus news via GDELT API + curated seed data on Leaflet map
 */

'use strict';

// ── Config ──────────────────────────────────────────────────────────────────
const GDELT_BASE = 'https://api.gdeltproject.org/api/v2/doc/doc';
const NOMINATIM  = 'https://nominatim.openstreetmap.org/search';
const MAP_TILES  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const MAP_ATTR   = '© <a href="https://carto.com/">CARTO</a> © <a href="https://openstreetmap.org/">OSM</a>';

// ── Location keyword → [lat, lng, display_name] ─────────────────────────────
const LOC_MAP = {
  // Americas
  'argentina':[-38.4,-63.6,'Argentina'], 'patagonia':[-44.0,-68.5,'Patagonia, Argentina'],
  'chubut':[-43.3,-65.1,'Chubut, Argentina'], 'neuquén':[-38.9,-68.1,'Neuquén, Argentina'],
  'neuquen':[-38.9,-68.1,'Neuquén, Argentina'], 'rio negro':[-40.8,-63.0,'Río Negro, Argentina'],
  'bariloche':[-41.1,-71.3,'Bariloche, Argentina'], 'epuyén':[-42.2,-71.4,'Epuyén, Argentina'],
  'chile':[-35.7,-71.5,'Chile'], 'brazil':[-14.2,-51.9,'Brazil'],
  'brasil':[-14.2,-51.9,'Brazil'], 'são paulo':[-23.5,-46.6,'São Paulo, Brazil'],
  'mato grosso':[-12.6,-55.9,'Mato Grosso, Brazil'], 'bolivia':[-16.3,-63.6,'Bolivia'],
  'paraguay':[-23.4,-58.4,'Paraguay'], 'uruguay':[-32.5,-55.8,'Uruguay'],
  'venezuela':[ 6.4,-66.6,'Venezuela'], 'colombia':[ 4.6,-74.1,'Colombia'],
  'panama':[ 8.5,-80.8,'Panama'], 'peru':[-9.2,-75.0,'Peru'],
  'ecuador':[-1.8,-78.2,'Ecuador'],
  'united states':[ 37.1,-95.7,'United States'], 'usa':[ 37.1,-95.7,'United States'],
  'u.s.':[ 37.1,-95.7,'United States'], 'america':[ 37.1,-95.7,'United States'],
  'four corners':[ 37.0,-108.6,'Four Corners, USA'], 'yosemite':[ 37.7,-119.6,'Yosemite, USA'],
  'california':[ 36.8,-119.4,'California, USA'], 'colorado':[ 39.1,-105.4,'Colorado, USA'],
  'new mexico':[ 34.3,-106.0,'New Mexico, USA'], 'utah':[ 39.3,-111.1,'Utah, USA'],
  'arizona':[ 34.3,-111.1,'Arizona, USA'], 'texas':[ 31.0,-100.0,'Texas, USA'],
  'washington':[ 47.4,-120.5,'Washington, USA'], 'canada':[ 56.1,-106.3,'Canada'],
  'british columbia':[ 53.7,-127.6,'British Columbia, Canada'],
  'saskatchewan':[ 52.9,-106.5,'Saskatchewan, Canada'],

  // Europe
  'netherlands':[ 52.4,  5.3,'Netherlands'], 'dutch':[ 52.4, 5.3,'Netherlands'],
  'holland':[ 52.4, 5.3,'Netherlands'], 'germany':[ 51.2, 10.5,'Germany'],
  'german':[ 51.2, 10.5,'Germany'], 'deutschland':[ 51.2, 10.5,'Germany'],
  'bavaria':[ 48.8, 11.5,'Bavaria, Germany'], 'sweden':[ 60.1, 18.6,'Sweden'],
  'finland':[ 61.9, 25.7,'Finland'], 'norway':[ 64.5, 17.9,'Norway'],
  'france':[ 46.2,  2.2,'France'], 'ardennes':[ 49.5,  5.1,'Ardennes, France'],
  'russia':[ 55.7, 37.6,'Russia'], 'bashkortostan':[ 54.7, 55.9,'Bashkortostan, Russia'],
  'ukraine':[ 48.4, 31.2,'Ukraine'], 'spain':[ 40.5, -3.7,'Spain'],
  'portugal':[ 39.4, -8.2,'Portugal'], 'belgium':[ 50.5,  4.5,'Belgium'],
  'uk':[ 55.4, -3.4,'United Kingdom'], 'united kingdom':[ 55.4, -3.4,'United Kingdom'],
  'england':[ 52.4, -1.9,'England, UK'], 'serbia':[ 44.0, 21.0,'Serbia'],
  'balkans':[ 43.9, 20.5,'Balkans'],

  // Asia
  'china':[ 35.9, 104.2,'China'], 'chinese':[ 35.9, 104.2,'China'],
  'south korea':[ 35.9, 127.8,'South Korea'], 'korea':[ 37.6, 127.0,'South Korea'],
  'north korea':[ 40.3, 127.5,'North Korea'],
  'japan':[ 36.2, 138.3,'Japan'], 'russia far east':[ 52.5, 131.0,'Russian Far East'],
  'thailand':[ 13.7, 100.5,'Thailand'], 'singapore':[ 1.4, 103.8,'Singapore'],
  'india':[ 20.6, 78.9,'India'], 'china mainland':[ 35.9, 104.2,'China'],

  // Africa & Oceania
  'south africa':[-29.0, 25.1,'South Africa'], 'australia':[-25.3, 133.8,'Australia'],
  'new zealand':[-40.9, 174.9,'New Zealand'],

  // Key locations in 2026 cruise ship outbreak
  'cape verde':[ 15.1,-23.6,'Cape Verde'], 'hondius':[ 52.4, 5.0,'Netherlands (MV Hondius)'],
  'cruise':[ 52.4, 5.0,'Netherlands (MV Hondius)'], 'ship':[ 52.4, 5.0,'Netherlands (MV Hondius)'],
  'atlantic':[ 30.0,-30.0,'Atlantic Ocean'],
};

// ── State ────────────────────────────────────────────────────────────────────
let map, liveLayer, seedLayer;
let geocodeCache = {};
let currentTimespan = '1month';
let showLive = true, showHistorical = true;

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  attachControls();
  loadData(currentTimespan);
});

function initMap() {
  map = L.map('map', { center: [20, 10], zoom: 3, zoomControl: true });
  L.tileLayer(MAP_TILES, { attribution: MAP_ATTR, subdomains: 'abcd', maxZoom: 19 }).addTo(map);
  liveLayer = L.markerClusterGroup({
    showCoverageOnHover: false,
    iconCreateFunction: clusterIcon,
    spiderfyOnMaxZoom: true,
  }).addTo(map);
  seedLayer = L.layerGroup().addTo(map);
}

// ── Data Loading ─────────────────────────────────────────────────────────────
async function loadData(timespan) {
  showLoading(true);
  setProgress(10, 'Connecting to GDELT news database…');
  try {
    const articles = await fetchGDELT(timespan);
    setProgress(40, `Processing ${articles.length} articles…`);
    const locationMap = extractLocations(articles);
    setProgress(70, `Mapping ${Object.keys(locationMap).length} locations…`);
    renderLivePins(locationMap);
    setProgress(90, 'Adding historical outbreak data…');
    renderSeedPins();
    updateStats(articles, Object.keys(locationMap).length);
    setProgress(100, 'Done.');
    setTimeout(() => showLoading(false), 600);
  } catch (e) {
    console.error('GDELT fetch failed:', e);
    setProgress(100, 'News fetch unavailable — showing historical data only.');
    renderSeedPins();
    updateStats([], 0);
    setTimeout(() => showLoading(false), 1200);
  }
}

async function fetchGDELT(timespan) {
  // Simple keyword query — GDELT reliably returns articles containing "hantavirus"
  const url = `${GDELT_BASE}?query=hantavirus&mode=artlist&format=json&timespan=${timespan}&maxrecords=250`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('GDELT HTTP ' + r.status);
  const data = await r.json();
  const articles = data.articles || [];

  // Client-side filter: drop anything whose title + URL doesn't contain "hantavir"
  // (covers hantavirus, hantaviral, hantavirüs, etc. across languages)
  return articles.filter(a => {
    const text = ((a.title || '') + ' ' + (a.url || '')).toLowerCase();
    return /hantavir/i.test(text);
  });
}

// ── Location Extraction ───────────────────────────────────────────────────────
function extractLocations(articles) {
  const locationMap = {};

  articles.forEach(article => {
    const title = (article.title || '').toLowerCase();
    let matched = null;

    // 1. Try LOC_MAP against title
    for (const [kw, coords] of Object.entries(LOC_MAP)) {
      const pattern = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (pattern.test(title)) {
        matched = { key: kw, lat: coords[0], lng: coords[1], name: coords[2] };
        break;
      }
    }

    // 2. Fall back to GDELT sourcecountry
    if (!matched && article.sourcecountry) {
      const sc = article.sourcecountry.toLowerCase();
      if (LOC_MAP[sc]) {
        const c = LOC_MAP[sc];
        matched = { key: sc, lat: c[0], lng: c[1], name: c[2] };
      } else {
        matched = { key: sc, lat: null, lng: null, name: article.sourcecountry };
      }
    }

    if (!matched) return;

    if (!locationMap[matched.key]) {
      locationMap[matched.key] = {
        lat: matched.lat, lng: matched.lng,
        name: matched.name, articles: []
      };
    }
    locationMap[matched.key].articles.push(article);
  });

  return locationMap;
}

// ── Render Live Pins ──────────────────────────────────────────────────────────
function renderLivePins(locationMap) {
  liveLayer.clearLayers();
  Object.entries(locationMap).forEach(([key, loc]) => {
    if (!loc.lat || !loc.lng) return;
    const count = loc.articles.length;
    const marker = L.marker([loc.lat, loc.lng], { icon: pinIcon('live', count) });
    marker.bindPopup(buildPopupHTML(loc.name, count, 'live'), { maxWidth: 280 });
    marker.on('click', () => openSidebar(loc.name, loc.articles, null));
    liveLayer.addLayer(marker);
  });
}

// ── Render Seed Pins ──────────────────────────────────────────────────────────
function renderSeedPins() {
  seedLayer.clearLayers();
  window.SEED_OUTBREAKS.forEach(ob => {
    const marker = L.marker([ob.lat, ob.lng], { icon: pinIcon('historical', 1) });
    marker.bindPopup(buildPopupHTML(ob.location, null, 'historical', ob), { maxWidth: 280 });
    marker.on('click', () => openSidebar(ob.location, [], ob));
    seedLayer.addLayer(marker);
  });
}

// ── Pin Icon ──────────────────────────────────────────────────────────────────
function pinIcon(type, count) {
  const isLive = type === 'live';
  const sz = Math.min(32 + (count > 1 ? count * 2 : 0), 48);
  const pulse = isLive ? `<div class="pin-pulse"></div><div class="pin-pulse-2"></div>` : '';
  const inner = isLive
    ? `<span class="pin-count" style="font-size:${count > 9 ? '9' : '11'}px">${count}</span>`
    : `<svg class="pin-icon-svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>`;

  return L.divIcon({
    className: '',
    html: `<div class="pin-${type}" style="width:${sz}px;height:${sz}px;">
      ${pulse}<div class="pin-inner" style="width:${sz}px;height:${sz}px;">${inner}</div>
    </div>`,
    iconSize: [sz, sz],
    iconAnchor: [sz / 2, sz],
    popupAnchor: [0, -sz],
  });
}

// ── Cluster Icon ──────────────────────────────────────────────────────────────
function clusterIcon(cluster) {
  const n = cluster.getChildCount();
  const sz = n < 10 ? 40 : n < 50 ? 48 : 56;
  return L.divIcon({
    html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:rgba(230,57,70,0.25);border:2px solid rgba(230,57,70,0.6);display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;font-weight:800;font-size:13px;color:white;box-shadow:0 0 20px rgba(230,57,70,0.4)">${n}</div>`,
    className: '', iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2],
  });
}

// ── Popup HTML ────────────────────────────────────────────────────────────────
function buildPopupHTML(name, count, type, ob) {
  if (type === 'live') {
    return `<div class="popup-location">📍 ${name}</div>
<div class="popup-count">${count} article${count !== 1 ? 's' : ''}</div>
<div class="popup-sub">Click to view news coverage</div>
<button class="popup-btn" onclick="document.getElementById('sidebar').classList.add('open')">View Articles →</button>`;
  }
  return `<div class="popup-location">📍 ${ob.location}</div>
<div class="popup-count">${ob.cases?.toLocaleString() || '?'} cases</div>
<div class="popup-sub">Hantavirus · ${ob.year}</div>
<button class="popup-btn" onclick="document.getElementById('sidebar').classList.add('open')">View Details →</button>`;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function openSidebar(locationName, articles, seedOb) {
  const sb = document.getElementById('sidebar');
  const title = document.getElementById('sidebar-location');
  const content = document.getElementById('sidebar-content');

  title.textContent = locationName;
  content.innerHTML = '';
  sb.classList.add('open');

  // Historical record
  if (seedOb) {
    content.insertAdjacentHTML('beforeend', `<div class="sidebar-section-label">Historical Record</div>`);
    content.insertAdjacentHTML('beforeend', buildSeedCard(seedOb));
  }

  // Live articles
  if (articles && articles.length > 0) {
    content.insertAdjacentHTML('beforeend', `<div class="sidebar-section-label">Live News Coverage (${articles.length})</div>`);
    articles.slice(0, 20).forEach(a => {
      content.insertAdjacentHTML('beforeend', buildArticleCard(a));
    });
  } else if (!seedOb) {
    content.insertAdjacentHTML('beforeend', `<div class="no-news">No recent articles found for this location in the selected time window.</div>`);
  }
}

function buildSeedCard(ob) {
  const deaths = ob.deaths ? `<div class="seed-stat"><div class="seed-stat-num">${ob.deaths.toLocaleString()}</div><div class="seed-stat-label">Deaths</div></div>` : '';
  return `<div class="seed-card">
  <div class="seed-card-header">
    <div class="seed-card-title">${ob.location}</div>
    <span class="badge-year">${ob.year}</span>
  </div>
  <div class="seed-card-strain">🧬 Hantavirus strain: ${ob.strain}${ob.cfr ? ` &nbsp;<span style="color:var(--red);font-weight:700">CFR ${ob.cfr}</span>` : ''}</div>
  <div class="seed-card-stats">
    <div class="seed-stat"><div class="seed-stat-num">${ob.cases?.toLocaleString() || '?'}</div><div class="seed-stat-label">Cases</div></div>
    ${deaths}
  </div>
  <div class="seed-card-desc">${ob.description}</div>
  <a class="seed-card-link" href="${ob.sourceUrl}" target="_blank" rel="noopener">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
    ${ob.sourceName}
  </a>
</div>`;
}

function buildArticleCard(a) {
  const date = a.seendate
    ? new Date(a.seendate.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z')).toLocaleDateString()
    : '';
  const thumb = a.socialimage
    ? `<img class="article-thumb" src="${a.socialimage}" alt="" loading="lazy" onerror="this.style.display='none'">`
    : '';
  return `<div class="article-card">
  <a href="${a.url}" target="_blank" rel="noopener">
    ${thumb}
    <div class="article-domain">${a.domain}</div>
    <div class="article-title">${a.title}</div>
    <div class="article-date">${date}</div>
  </a>
  <div class="article-card-footer">
    <span class="article-lang">${a.language || ''}</span>
    <span class="article-read-more">Read full article →</span>
  </div>
</div>`;
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
function updateStats(articles, liveLocations) {
  document.getElementById('stat-articles').textContent = articles.length;
  document.getElementById('stat-locations').textContent = liveLocations + window.SEED_OUTBREAKS.length;
  document.getElementById('stat-updated').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Controls ──────────────────────────────────────────────────────────────────
function attachControls() {
  // Timespan
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTimespan = btn.dataset.timespan;
      liveLayer.clearLayers();
      loadData(currentTimespan);
    });
  });

  // Sidebar close
  document.getElementById('sidebar-close').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
  });

  // Toggle live layer
  document.getElementById('toggle-live').addEventListener('click', function () {
    showLive = !showLive;
    this.classList.toggle('toggled-off', !showLive);
    showLive ? map.addLayer(liveLayer) : map.removeLayer(liveLayer);
  });

  // Toggle historical layer
  document.getElementById('toggle-historical').addEventListener('click', function () {
    showHistorical = !showHistorical;
    this.classList.toggle('toggled-off', !showHistorical);
    showHistorical ? map.addLayer(seedLayer) : map.removeLayer(seedLayer);
  });

  // Close sidebar on map click
  map.on('click', () => document.getElementById('sidebar').classList.remove('open'));
}

// ── Loading Helpers ───────────────────────────────────────────────────────────
function showLoading(visible) {
  document.getElementById('loading-overlay').classList.toggle('hidden', !visible);
}
function setProgress(pct, msg) {
  document.getElementById('loading-progress').style.width = pct + '%';
  if (msg) document.getElementById('loading-status').textContent = msg;
}
