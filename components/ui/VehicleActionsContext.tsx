"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { fetchCarsByIds } from "@/lib/client/cars";

const STORAGE_KEY = "imperium-vehicle-actions";

type StoredVehicleActions = {
  favorites: string[];
  comparisons: string[];
};

type VehicleActionsContextValue = {
  favoriteIds: string[];
  comparisonIds: string[];
  favoriteCount: number;
  comparisonCount: number;
  storageReady: boolean;
  isFavorite: (vehicleId: string) => boolean;
  isCompared: (vehicleId: string) => boolean;
  setFavorite: (vehicleId: string, active: boolean) => void;
  setCompared: (vehicleId: string, active: boolean) => void;
};

const VehicleActionsContext =
  createContext<VehicleActionsContextValue | null>(null);

function updateMembership(
  setter: Dispatch<SetStateAction<string[]>>,
  vehicleId: string,
  active: boolean,
) {
  setter((current) => {
    const exists = current.includes(vehicleId);
    if (exists === active) return current;
    return active
      ? [...current, vehicleId]
      : current.filter((id) => id !== vehicleId);
  });
}

function parseStoredIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value.filter(
        (id): id is string => typeof id === "string" && id.length > 0,
      ),
    ),
  ];
}

export type VehicleActionsProviderProps = {
  children: ReactNode;
  /** Актуальные ID из текущего источника данных (моки, API или 1С). */
  validVehicleIds?: readonly string[];
};

export function VehicleActionsProvider({
  children,
  validVehicleIds,
}: VehicleActionsProviderProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparisons, setComparisons] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const validVehicleIdSet = useMemo(
    () => (validVehicleIds ? new Set(validVehicleIds) : null),
    [validVehicleIds],
  );

  useEffect(() => {
    const requestController = new AbortController();

    async function restoreStoredActions() {
      let nextFavorites: string[] = [];
      let nextComparisons: string[] = [];

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as unknown;
          if (parsed && typeof parsed === "object") {
            const actions = parsed as Partial<StoredVehicleActions>;
            nextFavorites = parseStoredIds(actions.favorites);
            nextComparisons = parseStoredIds(actions.comparisons);
          }
        }
      } catch {
        // Storage can be unavailable or malformed; start from empty sets.
      }

      if (validVehicleIdSet) {
        nextFavorites = nextFavorites.filter((id) => validVehicleIdSet.has(id));
        nextComparisons = nextComparisons.filter((id) =>
          validVehicleIdSet.has(id),
        );
      } else {
        const storedIds = [...new Set([...nextFavorites, ...nextComparisons])];
        if (storedIds.length > 0) {
          try {
            const cars = await fetchCarsByIds(
              storedIds,
              requestController.signal,
            );
            const resolvedIds = new Set(cars.map((car) => car.id));
            nextFavorites = nextFavorites.filter((id) => resolvedIds.has(id));
            nextComparisons = nextComparisons.filter((id) =>
              resolvedIds.has(id),
            );
          } catch {
            if (requestController.signal.aborted) return;
            // A temporary data-source error must not delete the user's IDs.
          }
        }
      }

      if (requestController.signal.aborted) return;
      setFavorites(nextFavorites);
      setComparisons(nextComparisons);
      setStorageReady(true);
    }

    void restoreStoredActions();
    return () => requestController.abort();
  }, [validVehicleIdSet]);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          { favorites, comparisons } satisfies StoredVehicleActions,
        ),
      );
    } catch {
      // Keep the in-memory state when persistent storage is unavailable.
    }
  }, [comparisons, favorites, storageReady]);

  function setFavorite(vehicleId: string, active: boolean) {
    if (validVehicleIdSet && !validVehicleIdSet.has(vehicleId)) return;
    updateMembership(setFavorites, vehicleId, active);
  }

  function setCompared(vehicleId: string, active: boolean) {
    if (validVehicleIdSet && !validVehicleIdSet.has(vehicleId)) return;
    updateMembership(setComparisons, vehicleId, active);
  }

  return (
    <VehicleActionsContext.Provider
      value={{
        favoriteIds: favorites,
        comparisonIds: comparisons,
        favoriteCount: favorites.length,
        comparisonCount: comparisons.length,
        storageReady,
        isFavorite: (vehicleId) => favorites.includes(vehicleId),
        isCompared: (vehicleId) => comparisons.includes(vehicleId),
        setFavorite,
        setCompared,
      }}
    >
      {children}
    </VehicleActionsContext.Provider>
  );
}

export function useVehicleActions() {
  const context = useContext(VehicleActionsContext);
  if (!context) {
    throw new Error(
      "useVehicleActions must be used inside VehicleActionsProvider",
    );
  }
  return context;
}

export function useVehicleActionsOptional() {
  return useContext(VehicleActionsContext);
}
