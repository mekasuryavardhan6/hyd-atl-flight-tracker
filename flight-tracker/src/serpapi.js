import { config } from "./config.js";

const endpoint = "https://serpapi.com/search.json";

function requireApiKey() {
  if (!config.serpApi.apiKey) {
    throw new Error("Missing SERPAPI_KEY. Add it as a GitHub Actions secret or local env var.");
  }
}

async function serpApiSearch(params) {
  requireApiKey();

  const url = new URL(endpoint);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  url.searchParams.set("api_key", config.serpApi.apiKey);

  const response = await fetch(url);
  const body = await response.json();

  if (!response.ok || body.error) {
    throw new Error(body.error || `SerpApi request failed with HTTP ${response.status}`);
  }

  return body;
}

function baseParams(datePair) {
  return {
    engine: "google_flights",
    type: 1,
    departure_id: config.route.from,
    arrival_id: config.route.to,
    outbound_date: datePair.depart,
    return_date: datePair.return,
    adults: config.route.passengers,
    currency: config.route.currency,
    gl: config.route.locale.gl,
    hl: config.route.locale.hl,
    stops: 2,
    exclude_airlines: config.hardRules.excludedAirlineCodes.join(","),
    layover_duration: `${config.layover.acceptableMinMinutes},${config.layover.acceptableMaxMinutes}`,
    show_hidden: true,
    deep_search: config.serpApi.deepSearch
  };
}

export async function getOutboundOptions(datePair) {
  const result = await serpApiSearch(baseParams(datePair));
  const options = [...(result.best_flights || []), ...(result.other_flights || [])];

  return {
    sourceUrl: result.search_metadata?.google_flights_url,
    options
  };
}

export async function getReturnOptions(datePair, departureToken) {
  const result = await serpApiSearch({
    ...baseParams(datePair),
    departure_token: departureToken
  });

  const options = [...(result.best_flights || []), ...(result.other_flights || [])];

  return {
    sourceUrl: result.search_metadata?.google_flights_url,
    options
  };
}

export function googleFlightsSearchUrl(datePair) {
  const query = new URL("https://www.google.com/travel/flights");
  query.searchParams.set(
    "q",
    `Round trip flights from ${config.route.from} to ${config.route.to} depart ${datePair.depart} return ${datePair.return}`
  );
  return query.toString();
}
