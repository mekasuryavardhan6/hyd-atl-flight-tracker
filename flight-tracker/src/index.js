import { config } from "./config.js";
import { passesHardRules } from "./filter.js";
import { buildMessage } from "./message.js";
import { notify } from "./notify.js";
import { rankResults } from "./rank.js";
import { getOutboundOptions, getReturnOptions, googleFlightsSearchUrl } from "./serpapi.js";

async function collectDatePair(datePair) {
  const outboundResult = await getOutboundOptions(datePair);
  const outboundMatches = outboundResult.options
    .filter(passesHardRules)
    .filter((option) => option.departure_token)
    .slice(0, config.ranking.maxOutboundPerDate);

  const roundTrips = [];

  for (const outbound of outboundMatches) {
    const returnResult = await getReturnOptions(datePair, outbound.departure_token);
    const returnMatches = returnResult.options.filter(passesHardRules);

    for (const returnOption of returnMatches) {
      roundTrips.push({
        datePair,
        outbound,
        return: returnOption,
        price: returnOption.price || outbound.price,
        link: returnResult.sourceUrl || outboundResult.sourceUrl || googleFlightsSearchUrl(datePair),
        source: "SerpApi Google Flights"
      });
    }
  }

  return roundTrips;
}

async function main() {
  const allResults = [];
  const errors = [];

  for (const datePair of config.datePairs) {
    try {
      allResults.push(...(await collectDatePair(datePair)));
    } catch (error) {
      errors.push(`${datePair.depart}: ${error.message}`);
    }
  }

  const ranked = rankResults(allResults);
  await notify(buildMessage(ranked, errors));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
