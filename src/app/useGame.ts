import { useEffect, useRef, useState } from "react";
import { categories } from "../data/catalog";
import { availableWords, createMatch, validateSettings } from "../game/rules";
import { loadPreferences, savePreferences } from "../storage/preferences";
import type { GameScreen, Match, Settings } from "../game/types";

// This hook stays mounted when screens change, preserving the session's used words.
export function useGame() {
  const [screen, setScreen] = useState<GameScreen>("cover");
  const [settings, setSettings] = useState<Settings>(loadPreferences);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [used, setUsed] = useState<Set<string>>(() => new Set());
  const [match, setMatch] = useState<Match | null>(null);
  const [playerIndex, setPlayerIndex] = useState(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const words = availableWords(categories, settings.categories, used);

  useEffect(() => savePreferences(settings), [settings]);

  function update(patch: Partial<Settings>) {
    setSettings((current) => ({ ...current, ...patch }));
    setError("");
  }

  function addPlayer() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Digite um nome para adicionar o jogador.");
      nameRef.current?.focus();
      return;
    }
    if (
      settings.players.some(
        (player) =>
          player.name.toLocaleLowerCase("pt-BR") ===
          trimmed.toLocaleLowerCase("pt-BR"),
      )
    ) {
      setError("Esse nome já está na partida. Use um apelido diferente.");
      return;
    }
    const id = [...crypto.getRandomValues(new Uint8Array(16))]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("");
    update({ players: [...settings.players, { id, name: trimmed }] });
    setName("");
    nameRef.current?.focus();
  }

  function removePlayer(id: string) {
    update({ players: settings.players.filter((player) => player.id !== id) });
  }

  function start() {
    if (name.trim()) {
      setError("Adicione o nome digitado usando o botão + antes de começar.");
      nameRef.current?.focus();
      return;
    }
    const message = validateSettings(settings, words);
    if (message) {
      setError(message);
      return;
    }
    const next = createMatch(settings, words);
    setMatch(next);
    setUsed((current) => new Set([...current, next.word.id]));
    setPlayerIndex(0);
    setError("");
    setScreen("reveal");
  }

  function nextPlayer() {
    if (!match) return;
    if (playerIndex === match.players.length - 1) setScreen("play");
    else setPlayerIndex((index) => index + 1);
  }

  function restart() {
    setMatch(null);
    setScreen("settings");
  }

  return {
    screen,
    settings,
    name,
    setName,
    error,
    match,
    playerIndex,
    nameRef,
    availableCount: words.length,
    usedCount: used.size,
    update,
    addPlayer,
    removePlayer,
    start,
    nextPlayer,
    restart,
    openSettings: () => setScreen("settings"),
    openCover: () => setScreen("cover"),
    revealResult: () => setScreen("result"),
  };
}
