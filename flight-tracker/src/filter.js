import { config } from "./config.js";

export function flattenFlights(option) {
  return Array.isArray(option?.flights) ? option.flights : [];
}

export function airlineNames(option) {
  return [...new Set(flattenFlights(option).map((flight) => flight.airline).filter(Boolean))];
}

export function airlineCodes(option) {
  return [
    ...new Set(
      flattenFlights(option)
        .flatMap((flight) => [
          flight.flight_number?.slice(0, 2),
          ...(flight.ticket_also_sold_by || []),
          flight.airline
        ])
        .filter(Boolean)
    )
  ];
}

export function hasExcludedAirline(option) {
  const names = airlineNames(option).join(" | ").toLowerCase();
  const codes = airlineCodes(option).map((item) => String(item).toUpperCase());

  return (
    config.hardRules.excludedAirlineNames.some((name) => names.includes(name.toLowerCase())) ||
    config.hardRules.excludedAirlineCodes.some((code) => codes.includes(code))
  );
}

export function stopCount(option) {
  if (Array.isArray(option?.layovers)) return option.layovers.length;
  return Math.max(0, flattenFlights(option).length - 1);
}

export function isExactlyOneStop(option) {
  return stopCount(option) === config.hardRules.stopsPerDirection;
}

export function layoverMinutes(option) {
  const firstLayover = Array.isArray(option?.layovers) ? option.layovers[0] : undefined;
  return Number.isFinite(firstLayover?.duration) ? firstLayover.duration : null;
}

export function layoverLabel(minutes) {
  if (!Number.isFinite(minutes)) return "unknown";
  if (minutes >= config.layover.idealMinMinutes && minutes <= config.layover.idealMaxMinutes) {
    return "ideal";
  }
  if (
    minutes >= config.layover.acceptableMinMinutes &&
    minutes <= config.layover.acceptableMaxMinutes
  ) {
    return "acceptable";
  }
  if (minutes < config.layover.acceptableMinMinutes) return "risky short";
  return "too long";
}

export function passesHardRules(option) {
  return isExactlyOneStop(option) && !hasExcludedAirline(option);
}

export function routeLabel(option) {
  const flights = flattenFlights(option);
  if (flights.length === 0) return "unknown";

  const airports = [flights[0]?.departure_airport?.id];
  for (const flight of flights) {
    airports.push(flight?.arrival_airport?.id);
  }

  return airports.filter(Boolean).join("-");
}
