/**
 * HANTARADAR - Core Application Logic
 * Live hantavirus news via GDELT API + curated seed data on Leaflet map
 */

'use strict';

// -- Config ------------------------------------------------------------------
const GDELT_BASE = 'https://api.gdeltproject.org/api/v2/doc/doc';
const NOMINATIM  = 'https://nominatim.openstreetmap.org/search';
const MAP_TILES  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const MAP_ATTR   = '(c) <a href="https://carto.com/">CARTO</a> (c) <a href="https://openstreetmap.org/">OSM</a>';

// -- Location keyword -> [lat, lng, display_name] -----------------------------
const LOC_MAP = {
      // Americas
      'argentina':[-38.4,-63.6,'Argentina'], 'patagonia':[-44.0,-68.5,'Patagonia, Argentina'],
      'chubut':[-43.3,-65.1,'Chubut, Argentina'], 'neuquen':[-38.9,-68.1,'Neuquen, Argentina'],
      'rio negro':[-40.8,-63.0,'Rio Negro, Argentina'], 'bariloche':[-41.1,-71.3,'Bariloche, Argentina'],
      'epuyen':[-42.2,-71.4,'Epuyen, Argentina'], 'chile':[-35.7,-71.5,'Chile'],
      'brazil':[-14.2,-51.9,'Brazil'], 'brasil':[-14.2,-51.9,'Brazil'],
      'sao paulo':[-23.5,-46.6,'Sao Paulo, Brazil'], 'mato grosso':[-12.6,-55.9,'Mato Grosso, Brazil'],
      'bolivia':[-16.3,-63.6,'Bolivia'], 'paraguay':[-23.4,-58.4,'Paraguay'],
      'uruguay':[-32.5,-55.8,'Uruguay'],
      'venezuela':[ 6.4,-66.6,'Venezuela'], 'colombia':[ 4.6,-74.1,'Colombia'],
      'panama':[ 8.5,-80.8,'Panama'], 'peru':[-9.2,-75.0,'Peru'],
      'ecuador':[-1.8,-78.2,'Ecuador'],
      'united states':[ 37.1,-95.7,'United States'], 'usa':[ 37.1,-95.7,'United States'],
      'u.s.':[ 37.1,-95.7,'United States'], 'america':[ 37.1,-95.7,'United States'],
      'four corners':[ 37.0,-108.6,'Four Corners, USA'], 'yosemite':[ 37.7,-119.6,'Yosemite, USA'],
      'california':[ 36.8,-119.4,'California, USA'], 'colorado':[ 39.1,-105.4,'Colorado, USA'
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
                                                    'japan':[ 36.2, 138.3,'Japan'], 'tokyo':[ 35.7, 139.7,'Tokyo, Japan'],
      'vietnam':[ 14.1, 108.3,'Vietnam'], 'thailand':[ 15.9, 101.0,'Thailand'],

      // Africa
                       'nigeria':[  9.1,   8.7,'Nigeria'], 'south africa':[-30.6,  22.9,'South Africa'],
                                                  };

// -- GDELT News Fetcher ------------------------------------------------------
                                                             async function fetchHantaNews() {
  const query = '(hantavirus OR "hanta virus" OR "orthohantavirus")';
                                                              const url = \`\${GDELT_BASE}?query=\${encodeURIComponent(query)}&mode=artlist&format=json&maxresults=50&timespan=1m\`;
                                                                     try {
                                                                         const res = await fetch(url);
                                                                             const data = await res.json();
                                                                                 return (data.articles || []).map(art => ({
                                                                                       title: art.title,
                                                                                             url: art.url,
                                                                                                   date: art.seendate,
                                                                                                         source: art.sourcecountry || 'Unknown',
                                                                                                               lat: null, lng: null, // To be geocoded
                                                                                                                     location_name: ''
                                                                                                                         }));
                                                                                                                           } catch (err) {
                                                                                                                               console.error('GDELT Fetch Error:', err);
                                                                                                                                   return [];
                                                                                                                                     }
                                                                                                             
                                                                                                                                     // -- Geocoding / Keyword Matching -------------------------------------------
                                                                                                                                     function geocode(article) {
                                                                                                                                       const text = (article.title + ' ' + (article.location_name || '')).toLowerCase();
                                                                                                                                         for (const [key, coords] of Object.entries(LOC_MAP)) {
                                                                                                                                             if (text.includes(key)) {
                                                                                                                                                   article.lat = coords[0];
                                                                                                                                                         article.lng = coords[1];
                                                                                                                                                               article.location_name = coords[2];
                                                                                                                                                                     return true;
                                                                                                                                                                         }
                                                                                                                                                                           }
                                                                                                                                                                             return false;
}

// -- Map Setup ---------------------------------------------------------------
let map, markerLayer;

function initMap() {
  map = L.map('map').setView([10, 0], 2);
    L.tileLayer(MAP_TILES, { attribution: MAP_ATTR }).addTo(map);
      markerLayer = L.layerGroup().addTo(map);
      }

      function updateMarkers(articles) {
        markerLayer.clearLayers();
          articles.forEach(art => {
              if (geocode(art)) {
                    const popup = \`<b>\${art.title}</b><br><small>\${art.date}</small><br><a href="\${art.url}" target="_blank">Read Article</a>\`;
                          L.marker([art.lat, art.lng])
                                  .bindPopup(popup)
                                          .addTo(markerLayer);
                                              }
                                                });
                                                }

                                                // -- Main --------------------------------------------------------------------
                                                async function main() {
                                                  initMap();

                                                    // Load Seed Data
                                                      if (window.HANTA_SEED_DATA) {
                                                          updateMarkers(window.HANTA_SEED_DATA);
                                                            }

                                                              // Load GDELT Data
                                                                const liveNews = await fetchHantaNews();
                                                                  updateMarkers(liveNews);
                                                                  }

                                                                  document.addEventListener('DOMContentLoaded', main);
                                                                  
                                                                                                                                     }
                                                                                                                                     
