import type { Car } from "@/lib/cars";

type CarsByIdsResponse = {
  cars?: unknown;
};

export async function fetchCarsByIds(
  ids: readonly string[],
  signal?: AbortSignal,
): Promise<Car[]> {
  if (ids.length === 0) return [];

  const response = await fetch("/api/cars/by-ids", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Cars request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as CarsByIdsResponse;
  if (!Array.isArray(payload.cars)) {
    throw new Error("Cars response has an invalid shape");
  }

  return payload.cars as Car[];
}
