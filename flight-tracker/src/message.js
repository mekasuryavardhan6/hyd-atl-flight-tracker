import { config } from "./config.js";
import { airlineNames, layoverLabel, layoverMinutes, routeLabel } from "./filter.js";
import { formatMinutes, shortDate } from "./time.js";

function optionLine(result, index) {
  const outboundLayover = layoverMinutes(result.outbound);
  const returnLayover = layoverMinutes(result.return);
  const airlines = [
    ...new Set([...airlineNames(result.outbound), ...airlineNames(result.return)])
  ].join(" / ");

  const alert =
    result.price <= config.ranking.priceAlertUsd
      ? "GOOD PRICE"
      : result.price > 1500
        ? "PRICEY"
        : "WATCH";

  return [
    `${index + 1}. ${alert}: $${result.price} round trip`,
    `Dates: ${result.datePair.depart} -> ${result.datePair.return}`,
    `Airlines: ${airlines || "unknown"}`,
    `Outbound: ${routeLabel(result.outbound)} | ${formatMinutes(result.outbound.total_duration)} | layover ${formatMinutes(outboundLayover)} (${layoverLabel(outboundLayover)})`,
    `Return: ${routeLabel(result.return)} | ${formatMinutes(result.return.total_duration)} | layover ${formatMinutes(returnLayover)} (${layoverLabel(returnLayover)})`,
    `Times: ${shortDate(result.outbound.flights?.[0]?.departure_airport?.time)} outbound, ${shortDate(result.return.flights?.[0]?.departure_airport?.time)} return`,
    `Link: ${result.link}`
  ].join("\n");
}

export function buildMessage(results, errors = []) {
  const header = [
    "HYD -> ATL round-trip tracker",
    "Rules: no Qatar/Emirates/Etihad, exactly 1 stop each way, layover near 2h preferred.",
    `Checked: ${new Date().toISOString()}`
  ].join("\n");

  if (results.length === 0) {
    return [
      header,
      "",
      "No matching flights found in this run.",
      errors.length ? `Errors: ${errors.join(" | ")}` : ""
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    header,
    "",
    ...results.map(optionLine),
    errors.length ? `\nNotes: ${errors.join(" | ")}` : ""
  ]
    .filter(Boolean)
    .join("\n\n");
}
