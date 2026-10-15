import { test } from "node:test";
import assert from "node:assert/strict";
import {
  defaultSettings,
  loadPreferences,
  parsePreferences,
  savePreferences,
} from "./preferences";

test("preserva nomes e opções de preferências válidas", () => {
  const saved = {
    players: [{ id: "ana", name: "Ana" }],
    categories: ["animais"],
    impostors: "2",
    rounds: "random",
  };
  assert.deepEqual(parsePreferences(JSON.stringify(saved)), saved);
});

test("preferências ausentes ou corrompidas não impedem abrir o jogo", () => {
  for (const value of [
    null,
    "",
    "{",
    "null",
    "[]",
    '{"players":null,"categories":[]}',
  ]) {
    assert.deepEqual(parsePreferences(value), defaultSettings());
  }
});

test("descarta categorias e jogadores inválidos e normaliza opções antigas", () => {
  const saved = {
    players: [null, { id: 1, name: "Erro" }, { id: "ana", name: "Ana" }],
    categories: ["animais", "inexistente", null],
    impostors: "99",
    rounds: "0",
  };
  assert.deepEqual(parsePreferences(JSON.stringify(saved)), {
    players: [{ id: "ana", name: "Ana" }],
    categories: ["animais"],
    impostors: "1",
    rounds: "2",
  });
});

test("IDs repetidos não viram jogadores ambíguos em uma partida", () => {
  const saved = {
    ...defaultSettings(),
    players: [
      { id: "igual", name: "Ana" },
      { id: "igual", name: "Beto" },
    ],
  };
  assert.deepEqual(parsePreferences(JSON.stringify(saved)), defaultSettings());
});

test("pré-renderização não depende de APIs do navegador e defaults não compartilham arrays", () => {
  assert.deepEqual(loadPreferences(), defaultSettings());
  assert.doesNotThrow(() => savePreferences(defaultSettings()));
  const first = defaultSettings();
  first.players.push({ id: "ana", name: "Ana" });
  first.categories.length = 0;
  const second = defaultSettings();
  assert.equal(second.players.length, 0);
  assert.equal(second.categories.length, 10);
});
