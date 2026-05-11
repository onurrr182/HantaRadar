/**
 * HANTARADAR — Fatal Strain Seed Data
 * Only strains with meaningful case fatality rates (≥5% CFR):
 *   HPS group (Americas): Andes, Sin Nombre, Araraquara, Juquitiba, Choclo, Laguna Negra — CFR 15–60%
 *   Hantaan / Dobrava (Asia & Balkans) — CFR 5–15%
 * Excluded (non-fatal): Puumala (CFR <0.1%), Seoul (CFR ~1%)
 */

window.SEED_OUTBREAKS = [

  // ── HPS — Americas (CFR 15–60%) ──────────────────────────────────────────
  {
    id: 'four-corners-1993',
    lat: 36.99, lng: -108.62,
    location: 'Four Corners, USA',
    country: 'United States',
    strain: 'Sin Nombre virus (SNV)', cfr: '~36%',
    year: 1993, cases: 53, deaths: 32,
    description: 'First recognized HPS outbreak. Identified near the NM/AZ/UT/CO border. CFR ~60% in the initial cluster — the event that defined Hantavirus Pulmonary Syndrome.',
    sourceName: 'CDC — Hantavirus', sourceUrl: 'https://www.cdc.gov/hantavirus/technical-info/hps-history.html', type: 'historical'
  },
  {
    id: 'yosemite-2012',
    lat: 37.74, lng: -119.57,
    location: 'Yosemite National Park, USA',
    country: 'United States',
    strain: 'Sin Nombre virus (SNV)', cfr: '~30%',
    year: 2012, cases: 10, deaths: 3,
    description: 'Outbreak linked to Curry Village tent cabins. 3 fatalities among 10 confirmed cases. Triggered mass notification of 230,000 park visitors.',
    sourceName: 'CDC', sourceUrl: 'https://www.cdc.gov/hantavirus/', type: 'historical'
  },
  {
    id: 'canada-hps',
    lat: 52.93, lng: -106.45,
    location: 'Saskatchewan, Canada',
    country: 'Canada',
    strain: 'Sin Nombre virus (SNV)', cfr: '~36%',
    year: 2003, cases: 7, deaths: 2,
    description: 'HPS cluster in rural Saskatchewan. Deer mouse exposure in agricultural settings. Managed by the Public Health Agency of Canada.',
    sourceName: 'PHAC', sourceUrl: 'https://www.canada.ca/en/public-health/services/diseases/hantavirus.html', type: 'historical'
  },
  {
    id: 'argentina-patagonia',
    lat: -40.77, lng: -71.04,
    location: 'Patagonia, Argentina',
    country: 'Argentina',
    strain: 'Andes virus (ANDV)', cfr: '~35%',
    year: 1995, cases: 240, deaths: 103,
    description: 'First confirmed Andes virus outbreak. Recurring annually since 1995. Andes is the ONLY hantavirus with documented person-to-person transmission.',
    sourceName: 'WHO', sourceUrl: 'https://www.who.int/', type: 'historical'
  },
  {
    id: 'argentina-andes-2018',
    lat: -43.30, lng: -65.10,
    location: 'Epuyén, Chubut, Argentina',
    country: 'Argentina',
    strain: 'Andes virus (ANDV)', cfr: '~38%',
    year: 2018, cases: 29, deaths: 11,
    description: 'Andes virus cluster with confirmed person-to-person transmission in 11 secondary cases. WHO global alert issued. One of the most studied human-to-human hantavirus events.',
    sourceName: 'WHO Disease Outbreak News', sourceUrl: 'https://www.who.int/csr/don/22-january-2019-hantavirus-argentina/en/', type: 'historical'
  },
  {
    id: 'chile-hps',
    lat: -36.82, lng: -72.15,
    location: 'Bio-Bío Region, Chile',
    country: 'Chile',
    strain: 'Andes virus (ANDV)', cfr: '~35%',
    year: 1997, cases: 850, deaths: 155,
    description: 'Chile has one of the highest cumulative HPS case counts in South America. Bio-Bío and Araucanía regions most affected. Endemic transmission ongoing.',
    sourceName: 'PAHO', sourceUrl: 'https://www.paho.org/', type: 'historical'
  },
  {
    id: 'brazil-hps',
    lat: -23.55, lng: -46.63,
    location: 'São Paulo / Mato Grosso, Brazil',
    country: 'Brazil',
    strain: 'Araraquara / Juquitiba virus', cfr: '~47%',
    year: 1993, cases: 1900, deaths: 670,
    description: 'Brazil has the highest cumulative HPS cases globally. Araraquara strain CFR up to 47% — among the most lethal hantaviruses known. São Paulo and Mato Grosso most affected.',
    sourceName: 'Brazilian Ministry of Health', sourceUrl: 'https://www.gov.br/saude/', type: 'historical'
  },
  {
    id: 'paraguay-hps',
    lat: -23.44, lng: -58.44,
    location: 'Paraguay',
    country: 'Paraguay',
    strain: 'Laguna Negra virus', cfr: '~17%',
    year: 1999, cases: 120, deaths: 46,
    description: 'Laguna Negra virus outbreak in the Chaco. CFR ~17%. Vesper mice (Calomys laucha) are the primary reservoir in dry grassland areas.',
    sourceName: 'PAHO', sourceUrl: 'https://www.paho.org/', type: 'historical'
  },
  {
    id: 'bolivia-hps',
    lat: -16.29, lng: -63.59,
    location: 'Bolivia',
    country: 'Bolivia',
    strain: 'Rio Mamoré / Laguna Negra virus', cfr: '~15%',
    year: 2004, cases: 45, deaths: 8,
    description: 'HPS cases in lowland Bolivia. Beni Department is the primary affected area. Related Laguna Negra clade viruses circulate in rodents across the region.',
    sourceName: 'PAHO', sourceUrl: 'https://www.paho.org/', type: 'historical'
  },
  {
    id: 'panama-hps',
    lat: 7.68, lng: -80.52,
    location: 'Los Santos, Panama',
    country: 'Panama',
    strain: 'Choclo virus', cfr: '~20%',
    year: 1999, cases: 106, deaths: 21,
    description: 'First Central American HPS outbreak. Choclo virus CFR ~20%. Azuero Peninsula remains endemic. Only hantavirus outbreak documented in Central America.',
    sourceName: 'CDC EID', sourceUrl: 'https://wwwnc.cdc.gov/eid/', type: 'historical'
  },

  // ── Hantaan / Dobrava — Asia & Balkans (CFR 5–15%) ───────────────────────
  {
    id: 'china-hfrs',
    lat: 30.29, lng: 120.16,
    location: 'China (nationwide)',
    country: 'China',
    strain: 'Hantaan virus (HTNV)', cfr: '5–15%',
    year: 2020, cases: 100000, deaths: 1000,
    description: 'China reports the most HFRS cases globally (~100,000/yr at peak). Hantaan virus CFR 5–15%. North-east China most affected. Striped field mice are the primary reservoir.',
    sourceName: 'Chinese CDC', sourceUrl: 'https://www.chinacdc.cn/', type: 'historical'
  },
  {
    id: 'south-korea-hfrs',
    lat: 37.57, lng: 127.00,
    location: 'South Korea',
    country: 'South Korea',
    strain: 'Hantaan virus (HTNV)', cfr: '5–15%',
    year: 2019, cases: 400, deaths: 8,
    description: 'South Korea is where Hantaan virus was first isolated (1976). Annual cases mostly in military and agricultural workers. CFR 5–15% without intensive care.',
    sourceName: 'Korea KDCA', sourceUrl: 'https://www.kdca.go.kr/', type: 'historical'
  },
  {
    id: 'balkans-dobrava',
    lat: 44.02, lng: 21.01,
    location: 'Balkans (Serbia / Bosnia)',
    country: 'Serbia',
    strain: 'Dobrava virus (DOBV)', cfr: '5–12%',
    year: 2017, cases: 180, deaths: 14,
    description: 'Dobrava virus outbreaks recur across the western Balkans. CFR 5–12% — significantly more lethal than other European hantaviruses. Yellow-necked mice are the reservoir.',
    sourceName: 'ECDC', sourceUrl: 'https://www.ecdc.europa.eu/', type: 'historical'
  },

  // ── 2026 Andes Virus — Active Global Cluster ─────────────────────────────
  {
    id: 'netherlands-hondius-2026',
    lat: 52.37, lng: 4.90,
    location: 'Netherlands (MV Hondius)',
    country: 'Netherlands',
    strain: 'Andes virus (ANDV)', cfr: '~35%',
    year: 2026, cases: 12, deaths: 1,
    description: 'Active outbreak on MV Hondius cruise returning from Patagonia. First intercontinental Andes virus cluster via travel. Secondary transmission via aircraft confirmed.',
    sourceName: 'RIVM Netherlands', sourceUrl: 'https://www.rivm.nl/', type: 'historical'
  },
  {
    id: 'cape-verde-2026',
    lat: 15.12, lng: -23.61,
    location: 'Cape Verde',
    country: 'Cape Verde',
    strain: 'Andes virus (ANDV)', cfr: '~35%',
    year: 2026, cases: 3, deaths: 1,
    description: 'MV Hondius stopover. Rodent exposure at Patagonian ports is the probable origin of the 2026 Andes virus cluster.',
    sourceName: 'Mirror UK', sourceUrl: 'https://www.mirror.co.uk/news/world-news/rat-virus-hantavirus-hondius-ship-37121251', type: 'historical'
  },
  {
    id: 'singapore-2026',
    lat: 1.35, lng: 103.82,
    location: 'Singapore',
    country: 'Singapore',
    strain: 'Andes virus (ANDV)', cfr: '~35%',
    year: 2026, cases: 2, deaths: 0,
    description: 'Two residents isolated at NCID after Andes virus exposure on MV Hondius. Part of the 2026 global cluster.',
    sourceName: 'Channel NewsAsia', sourceUrl: 'https://www.channelnewsasia.com/singapore/hantavirus-mv-hondius-ncid-test-virus-isolated-cda-6106671', type: 'historical'
  },
  {
    id: 'south-africa-2026',
    lat: -30.56, lng: 22.94,
    location: 'South Africa',
    country: 'South Africa',
    strain: 'Andes virus (ANDV)', cfr: '~35%',
    year: 2026, cases: 1, deaths: 0,
    description: 'Andes virus confirmed in a traveller from South America. Part of the 2026 MV Hondius cluster investigation.',
    sourceName: 'The South African', sourceUrl: 'https://www.thesouthafrican.com/', type: 'historical'
  }
];
