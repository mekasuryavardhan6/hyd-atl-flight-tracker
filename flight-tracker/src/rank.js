import { config } from "./config.js";
import { layoverLabel, layoverMinutes } from "./filter.js";

function layoverPenalty(option) {
  const label = layoverLabel(layoverMinutes(option));
  if (label === "ideal") return 0;
  if (label === "acceptable") return 90;
  if (label === "risky short") return 220;
  return 260;
}

export function scoreRoundTrip(result) {
  const priceScore = result.price || 99999;
  const durationScore = (result.outbound.total_duration || 9999) + (result.return.total_duration || 9999);
  const layoverScore = layoverPenalty(result.outbound) + layoverPenalty(result.return);

  return priceScore + durationScore * 1.6 + layoverScore;
}

export function rankResults(results) {
  return results
    .map((result) => ({ ...result, score: scoreRoundTrip(result) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, config.ranking.topResults);
}
