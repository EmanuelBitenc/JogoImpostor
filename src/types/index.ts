export interface Word { id: string; palavra: string; dicas: [string, string, string] }
export interface Category { id: string; nome: string; simbolo: string; palavras: Word[] }
export interface Player { id: string; name: string }
export type ImpostorMode = '1' | '2' | 'random';
export type RoundMode = '2' | '3' | '4' | 'random';
export interface Settings { players: Player[]; categories: string[]; impostors: ImpostorMode; rounds: RoundMode }
export interface Match { players: Player[]; impostorIds: string[]; word: Word; hint: string; rounds: number; startingPlayer: Player }
