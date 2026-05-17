export const config = {
  route: {
    from: "HYD",
    to: "ATL",
    passengers: 1,
    currency: "USD",
    locale: {
      gl: "us",
      hl: "en"
    }
  },
  datePairs: [
    { depart: "2026-06-15", return: "2026-09-12" },
    { depart: "2026-06-16", return: "2026-09-13" },
    { depart: "2026-06-17", return: "2026-09-14" },
    { depart: "2026-06-18", return: "2026-09-15" },
    { depart: "2026-06-19", return: "2026-09-16" }
  ],
  hardRules: {
    excludedAirlineCodes: ["QR", "EK", "EY"],
    excludedAirlineNames: ["Qatar Airways", "Emirates", "Etihad"],
    stopsPerDirection: 1
  },
  layover: {
    idealMinMinutes: 105,
    idealMaxMinutes: 180,
    acceptableMinMinutes: 75,
    acceptableMaxMinutes: 240
  },
  ranking: {
    maxOutboundPerDate: Number(process.env.MAX_OUTBOUND_PER_DATE || 4),
    topResults: Number(process.env.TOP_RESULTS || 5),
    priceAlertUsd: Number(process.env.PRICE_ALERT_USD || 1200)
  },
  serpApi: {
    apiKey: process.env.SERPAPI_KEY,
    deepSearch: String(process.env.DEEP_SEARCH || "false").toLowerCase() === "true"
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID
  },
  dryRun: String(process.env.DRY_RUN || "false").toLowerCase() === "true"
};
