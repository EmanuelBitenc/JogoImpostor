import { test } from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../data/words.json';
import { availableWords, createMatch, randomIndex, validateSettings } from './game';
import type { Category, Settings } from '../types';

const categories = catalog as Category[];
const settings: Settings = {
  players: Array.from({ length: 5 }, (_, i) => ({ id: String(i), name: `Jogador ${i + 1}` })),
  categories: categories.map(c => c.id), impostors: '1', rounds: '2',
};
const words = availableWords(categories, settings.categories, new Set());

test('o catálogo tem palavras únicas e exatamente três dicas diferentes por palavra', () => {
  const entries = categories.flatMap(c => c.palavras);
  assert.equal(entries.length, 200);
  assert.equal(new Set(entries.map(w => w.id)).size, entries.length);
  assert.equal(new Set(entries.map(w => w.palavra.toLocaleLowerCase('pt-BR'))).size, entries.length);
  for (const word of entries) {
    assert.ok(word.id && word.palavra.trim());
    assert.equal(word.dicas.length, 3);
    assert.equal(new Set(word.dicas).size, 3);
    assert.ok(word.dicas.every(hint => hint.trim() && hint.toLowerCase() !== word.palavra.toLowerCase()));
  }
});

test('palavras usadas ficam bloqueadas, mesmo ao trocar categorias', () => {
  const used = new Set([words[0].id]);
  assert.ok(!availableWords(categories, settings.categories, used).some(w => used.has(w.id)));
  assert.ok(!availableWords(categories, [categories[0].id], used).some(w => used.has(w.id)));
  assert.equal(availableWords(categories, [], used).length, 0);
  assert.equal(availableWords(categories, settings.categories, new Set(words.map(w => w.id))).length, 0);
});

test('sorteio de dois impostores não repete jogadores e usa uma dica compartilhada', () => {
  const match = createMatch({ ...settings, impostors: '2' }, words, () => 0);
  assert.equal(match.impostorIds.length, 2);
  assert.equal(new Set(match.impostorIds).size, 2);
  assert.equal(match.word.id, words[0].id);
  assert.equal(match.hint, words[0].dicas[0]);
  assert.equal(match.startingPlayer.id, settings.players[0].id);
});

test('modos aleatórios alcançam todos os valores e cada uma das três dicas', () => {
  const low = createMatch({ ...settings, impostors: 'random', rounds: 'random' }, words, () => 0);
  const high = createMatch({ ...settings, impostors: 'random', rounds: 'random' }, words, n => n - 1);
  const middle = createMatch({ ...settings, rounds: 'random' }, words, n => Math.min(1, n - 1));
  assert.equal(low.impostorIds.length, 1); assert.equal(high.impostorIds.length, 2);
  assert.equal(low.rounds, 2); assert.equal(middle.rounds, 3); assert.equal(high.rounds, 4);
  assert.equal(low.hint, low.word.dicas[0]); assert.equal(middle.hint, middle.word.dicas[1]); assert.equal(high.hint, high.word.dicas[2]);
});

test('valida mínimos, nomes, categorias e esgotamento antes de iniciar', () => {
  assert.equal(validateSettings({ ...settings, players: settings.players.slice(0, 3) }, words), null);
  assert.ok(validateSettings({ ...settings, impostors: '2', players: settings.players.slice(0, 4) }, words));
  assert.ok(validateSettings({ ...settings, impostors: 'random', players: settings.players.slice(0, 4) }, words));
  assert.ok(validateSettings({ ...settings, categories: [] }, words));
  assert.ok(validateSettings(settings, []));
  assert.ok(validateSettings({ ...settings, players: settings.players.map(p => ({ ...p, name: 'Mesmo nome' })) }, words));
  assert.throws(() => createMatch(settings, []));
});

test('uma sessão pode consumir o catálogo inteiro sem repetir', () => {
  const used = new Set<string>();
  for (let i = 0; i < words.length; i++) {
    const match = createMatch(settings, availableWords(categories, settings.categories, used));
    assert.ok(!used.has(match.word.id));
    used.add(match.word.id);
  }
  assert.equal(used.size, words.length);
  assert.equal(availableWords(categories, settings.categories, used).length, 0);
});

test('sorteador respeita os limites', () => {
  assert.throws(() => randomIndex(0));
  for (let i = 0; i < 100; i++) { const value = randomIndex(5); assert.ok(value >= 0 && value < 5); }
});
