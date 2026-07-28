"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

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
    ...new Set(value.filter((id): id is string => typeof id === "string")),
  ];
}

export function VehicleActionsProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparisons, setComparisons] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        if (parsed && typeof parsed === "object") {
          const actions = parsed as Partial<StoredVehicleActions>;
          setFavorites(parseStoredIds(actions.favorites));
          setComparisons(parseStoredIds(actions.comparisons));
        }
      }
    } catch {
      // Storage can be unavailable or contain stale data; start from empty sets.
    } finally {
      setStorageReady(true);
    }
  }, []);

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
    updateMembership(setFavorites, vehicleId, active);
  }

  function setCompared(vehicleId: string, active: boolean) {
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
