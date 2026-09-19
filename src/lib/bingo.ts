export const BOARD_SIZE = 5;
export const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;
export const FREE_SPACE_INDEX = 12; // center of 5x5
export const MAX_NUMBER = 99;

export function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateBoard(playerName: string, gameCode: string): number[] {
  const seed = hashString(`${gameCode}-${playerName}`);
  const rng = seededRandom(seed);

  const pool = Array.from({ length: MAX_NUMBER }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const board = pool.slice(0, TOTAL_CELLS);
  board[FREE_SPACE_INDEX] = 0; // 0 = free space
  return board;
}

export function generateDrawSequence(gameCode: string): number[] {
  const seed = hashString(gameCode);
  const rng = seededRandom(seed);

  const numbers = Array.from({ length: MAX_NUMBER }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
}

export function getAllLines(): number[][] {
  const lines: number[][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    lines.push(Array.from({ length: BOARD_SIZE }, (_, c) => r * BOARD_SIZE + c));
  }
  for (let c = 0; c < BOARD_SIZE; c++) {
    lines.push(Array.from({ length: BOARD_SIZE }, (_, r) => r * BOARD_SIZE + c));
  }
  lines.push(Array.from({ length: BOARD_SIZE }, (_, i) => i * BOARD_SIZE + i));
  lines.push(Array.from({ length: BOARD_SIZE }, (_, i) => i * BOARD_SIZE + (BOARD_SIZE - 1 - i)));
  return lines;
}

export function countCompletedLines(marked: boolean[]): {
  count: number;
  completedLines: number[][];
  isFullBoard: boolean;
} {
  const lines = getAllLines();
  const completedLines = lines.filter((line) =>
    line.every((idx) => marked[idx])
  );
  const isFullBoard = marked.every((m) => m);
  return { count: completedLines.length, completedLines, isFullBoard };
}

export function generateGameCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
