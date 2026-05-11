# 🦠 HantaRadar

**Real-time global hantavirus outbreak tracker** — live news from thousands of international sources plotted on an interactive dark-mode map.

![HantaRadar Screenshot](https://raw.githubusercontent.com/onurkeles/HantaRadar/main/screenshot.png)

## Features

- 🔴 **Live news pins** — fetches articles from [GDELT Project](https://gdeltproject.org/) (aggregates 50,000+ news sources worldwide), updated every 15 minutes
- 🟡 **Historical outbreak pins** — 16 curated records of significant outbreaks sourced from WHO, CDC, PAHO, ECDC
- 🧬 **Fatal strains only** — focuses on high case-fatality-rate hantaviruses (≥5% CFR): Andes, Sin Nombre, Hantaan, Araraquara, Choclo, Laguna Negra, Dobrava
- 📰 **Click any pin** → slide-in sidebar with article cards (thumbnail, source, date, direct link)
- 🗓 **Timespan filters** — 7 days / 1 month / 3 months / 6 months
- 👁 **Layer toggles** — show/hide live news or historical pins independently
- 🌐 **No API key required** — GDELT is completely free and CORS-enabled

## Hantavirus Strains Tracked

| Strain | Region | CFR |
|---|---|---|
| Andes virus (ANDV) | South America | ~35–38% |
| Sin Nombre virus (SNV) | North America | ~36% |
| Araraquara / Juquitiba | Brazil | ~47% |
| Choclo virus | Panama | ~20% |
| Laguna Negra / Rio Mamoré | Paraguay, Bolivia | ~15–17% |
| Hantaan virus (HTNV) | Asia | 5–15% |
| Dobrava virus (DOBV) | Balkans | 5–12% |

*Excluded: Puumala (CFR <0.1%) and Seoul virus (CFR ~1%) — not clinically fatal in the majority of cases.*

## How It Works

```
Browser
  ├── GDELT Doc API  →  hantavirus articles (live, CORS-enabled, no key)
  ├── Client-side filter  →  /hantavir/i regex ensures strict relevance
  ├── Location extractor  →  parses country/region from article titles
  └── Leaflet.js  →  CartoDB Dark Matter tiles, MarkerCluster, custom pins
```

## Tech Stack

- **Map**: [Leaflet.js](https://leafletjs.com/) + [Leaflet.MarkerCluster](https://github.com/Leaflet/Leaflet.markercluster)
- **Map tiles**: [CartoDB Dark Matter](https://carto.com/basemaps/) (free, no key)
- **News data**: [GDELT Project API v2](https://api.gdeltproject.org/api/v2/doc/doc)
- **Historical data**: WHO, CDC, PAHO, ECDC, ProMED
- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)
- Pure HTML/CSS/JS — no build step, no framework, no dependencies to install

## Usage

Just open `index.html` in any browser. No server required.

```bash
git clone https://github.com/onurrr182/HantaRadar.git
cd HantaRadar
open index.html   # macOS
```

## Data Sources

- **Live news**: GDELT Project — aggregates from BBC, Reuters, AP, Al Jazeera, and thousands of regional outlets in 65+ languages
- **Historical outbreaks**: [WHO](https://www.who.int/), [CDC](https://www.cdc.gov/hantavirus/), [PAHO](https://www.paho.org/), [ECDC](https://www.ecdc.europa.eu/), [ProMED](https://promedmail.org/)

## License

MIT
