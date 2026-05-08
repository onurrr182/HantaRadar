/* HantaRadar app.js */
const CONFIG = {
    gdeltEndpoint: 'https://api.gdeltproject.org/api/v2/doc/doc',
    updateInterval: 15 * 60 * 1000,
    strains: ['Andes', 'Sin Nombre', 'Hantaan', 'Araraquara', 'Choclo', 'Laguna Negra', 'Dobrava']
};
let map, markers;
function initMap() {
    map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
    markers = L.markerClusterGroup().addTo(map);
}
document.addEventListener('DOMContentLoaded', initMap);
async function fetchData() {
    const response = await fetch(CONFIG.gdeltEndpoint);
    const data = await response.json();
    data.articles.forEach(article => {
          if (CONFIG.strains.some(s => article.title.includes(s))) {
                  L.marker([article.lat, article.lng]).addTo(markers)
                    .bindPopup(`<b>${article.title}</b><br>${article.source}`);
          }
    });
}
setInterval(fetchData, CONFIG.updateInterval);
fetchData();
