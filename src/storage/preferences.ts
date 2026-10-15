import { categories } from "../data/catalog";
import type { Player, Settings } from "../game/types";

const storageKey = "um-de-nos:settings:v1";

export function defaultSettings(): Settings {
  return {
    players: [],
    categories: categories.map((category) => category.id),
    impostors: "1",
    rounds: "2",
  };
}

function isPlayer(value: unknown): value is Player {
  return (
    !!value &&
    typeof value === "object" &&
    "id" in value &&
    typeof value.id === "string" &&
    "name" in value &&
    typeof value.name === "string"
  );
}

export function parsePreferences(value: string | null): Settings {
  try {
    const saved = JSON.parse(value ?? "null");
    if (
      !saved ||
      !Array.isArray(saved.players) ||
      !Array.isArray(saved.categories)
    )
      return defaultSettings();
    const players: Player[] = saved.players.filter(isPlayer);
    if (new Set(players.map((player) => player.id)).size !== players.length)
      return defaultSettings();
    return {
      players,
      categories: saved.categories.filter((id: unknown) =>
        categories.some((category) => category.id === id),
      ),
      impostors: ["1", "2", "random"].includes(saved.impostors)
        ? saved.impostors
        : "1",
      rounds: ["2", "3", "4", "random"].includes(saved.rounds)
        ? saved.rounds
        : "2",
    };
  } catch {
    return defaultSettings();
  }
}

export function loadPreferences(): Settings {
  if (typeof window === "undefined") return defaultSettings();
  try {
    return parsePreferences(window.localStorage.getItem(storageKey));
  } catch {
    return defaultSettings();
  }
}

export function savePreferences(settings: Settings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  } catch {
    /* The game remains usable when browser storage is disabled. */
  }
}
