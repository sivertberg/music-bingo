"use client";

import { useState, useCallback, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import {
  generateBoard,
  checkBingo,
  BOARD_SIZE,
  TOTAL_CELLS,
  FREE_SPACE_INDEX,
} from "@/lib/bingo";

function Confetti() {
  const colors = ["#a855f7", "#fbbf24", "#ec4899", "#34d399", "#60a5fa"];
  return (
    <>
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </>
  );
}

export default function PlayPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const searchParams = useSearchParams();
  const playerName = searchParams.get("name") || "Player";

  const [board] = useState(() => generateBoard(playerName, code));
  const [marked, setMarked] = useState<boolean[]>(() => {
    const initial = new Array(TOTAL_CELLS).fill(false);
    initial[FREE_SPACE_INDEX] = true;
    return initial;
  });
  const [bingo, setBingo] = useState(false);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const toggleCell = useCallback(
    (index: number) => {
      if (index === FREE_SPACE_INDEX || bingo) return;
      setMarked((prev) => {
        const next = [...prev];
        next[index] = !next[index];
        return next;
      });
    },
    [bingo]
  );

  useEffect(() => {
    const result = checkBingo(marked);
    if (result.hasBingo && !bingo) {
      setBingo(true);
      setWinningLine(result.winningLine);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [marked, bingo]);

  return (
    <main className="flex-1 flex flex-col items-center p-4 gap-4">
      {showConfetti && <Confetti />}

      <div className="text-center">
        <h1 className="text-2xl font-bold">🎵 Music Bingo</h1>
        <p className="text-foreground/60 text-sm">
          {playerName} · Game{" "}
          <span className="font-mono text-accent-glow">{code}</span>
        </p>
      </div>

      {bingo && (
        <div className="animate-bingo bg-bingo-gold/20 border-2 border-bingo-gold rounded-2xl px-8 py-3 text-center">
          <span className="text-3xl font-black text-bingo-gold">
            🎉 BINGO! 🎉
          </span>
        </div>
      )}

      <div
        className="grid gap-1.5 w-full max-w-sm aspect-square"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        }}
      >
        {board.map((num, index) => {
          const isFree = index === FREE_SPACE_INDEX;
          const isMarked = marked[index];
          const isWinning = winningLine?.includes(index);

          return (
            <button
              key={index}
              onClick={() => toggleCell(index)}
              className={`
                rounded-lg font-bold text-lg transition-all duration-150 aspect-square
                flex items-center justify-center
                ${
                  isFree
                    ? "bg-accent/40 text-accent-glow cursor-default text-xs"
                    : isMarked
                      ? isWinning
                        ? "bg-bingo-gold text-black scale-105"
                        : "bg-marked text-white scale-95"
                      : "bg-surface-light hover:bg-surface-light/70 text-foreground active:scale-90"
                }
              `}
            >
              {isFree ? "FREE" : num}
            </button>
          );
        })}
      </div>

      <p className="text-foreground/40 text-xs text-center">
        Tap numbers as they&apos;re called. Get 5 in a row to win!
      </p>
    </main>
  );
}
