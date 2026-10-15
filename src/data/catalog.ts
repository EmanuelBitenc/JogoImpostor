import words from "./words.json";
import type { Category } from "../game/types";

export const categories = words as Category[];
export const wordCount = categories.reduce(
  (total, category) => total + category.palavras.length,
  0,
);
