export function randomIndex(length: number): number {
  if (!Number.isInteger(length) || length < 1)
    throw new Error("Não há opções para sortear.");
  // Rejection sampling avoids bias from the remainder operation.
  const limit = Math.floor(0x100000000 / length) * length;
  const value = new Uint32Array(1);
  do {
    crypto.getRandomValues(value);
  } while (value[0] >= limit);
  return value[0] % length;
}
