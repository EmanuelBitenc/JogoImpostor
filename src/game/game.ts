import type { Category, Match, Settings, Word } from '../types';

export function randomIndex(length: number): number {
  if (!Number.isInteger(length) || length < 1) throw new Error('Não há opções para sortear.');
  // Rejection sampling avoids bias from the remainder operation.
  const limit = Math.floor(0x100000000 / length) * length;
  const value = new Uint32Array(1);
  do { crypto.getRandomValues(value); } while (value[0] >= limit);
  return value[0] % length;
}

export function availableWords(categories: Category[], selected: string[], used: ReadonlySet<string>): Word[] {
  const unique = new Map<string, Word>();
  for (const category of categories) {
    if (!selected.includes(category.id)) continue;
    for (const word of category.palavras) if (!used.has(word.id)) unique.set(word.id, word);
  }
  return [...unique.values()];
}

export function validateSettings(settings: Settings, words: Word[]): string | null {
  const minimum = settings.impostors === '1' ? 3 : 5;
  if (settings.players.length < minimum) return `Adicione pelo menos ${minimum} jogadores para este modo.`;
  if (settings.players.some(player => !player.name.trim())) return 'Todos os jogadores precisam de um nome.';
  if (new Set(settings.players.map(p => p.name.trim().toLocaleLowerCase('pt-BR'))).size !== settings.players.length) return 'Use nomes diferentes para identificar os jogadores.';
  if (!settings.categories.length) return 'Selecione pelo menos uma categoria.';
  if (!words.length) return 'Vocês já jogaram todas as palavras dessas categorias. Selecione outras ou recarregue a página.';
  return null;
}

export function createMatch(settings: Settings, words: Word[], choose = randomIndex): Match {
  const error = validateSettings(settings, words);
  if (error) throw new Error(error);
  const count = settings.impostors === 'random' ? choose(2) + 1 : Number(settings.impostors);
  const pool = [...settings.players];
  const impostorIds: string[] = [];
  for (let i = 0; i < count; i++) impostorIds.push(pool.splice(choose(pool.length), 1)[0].id);
  const word = words[choose(words.length)];
  return {
    players: settings.players.map(player => ({ ...player })), impostorIds, word,
    hint: word.dicas[choose(word.dicas.length)],
    rounds: settings.rounds === 'random' ? choose(3) + 2 : Number(settings.rounds),
    startingPlayer: { ...settings.players[choose(settings.players.length)] },
  };
}
