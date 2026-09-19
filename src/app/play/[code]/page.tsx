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
import { getSong } from "@/lib/songs";

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
    <main className="flex-1 flex flex-col items-center p-3 gap-3">
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
        className="grid gap-1 w-full max-w-md"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        }}
      >
        {board.map((num, index) => {
          const isFree = index === FREE_SPACE_INDEX;
          const isMarked = marked[index];
          const isWinning = winningLine?.includes(index);
          const song = num > 0 ? getSong(num) : null;

          return (
            <button
              key={index}
              onClick={() => toggleCell(index)}
              className={`
                rounded-lg transition-all duration-150 aspect-square
                flex flex-col items-center justify-center p-0.5 overflow-hidden
                ${
                  isFree
                    ? "bg-accent/40 text-accent-glow cursor-default"
                    : isMarked
                      ? isWinning
                        ? "bg-bingo-gold text-black scale-[1.03]"
                        : "bg-marked text-white scale-[0.97]"
                      : "bg-surface-light hover:bg-surface-light/70 text-foreground active:scale-90"
                }
              `}
            >
              {isFree ? (
                <span className="text-xs font-bold">FREE</span>
              ) : (
                <>
                  <span className="text-[9px] leading-tight font-semibold text-center line-clamp-2 px-0.5">
                    {song?.title}
                  </span>
                  <span className={`text-[7px] leading-tight mt-0.5 ${
                    isMarked ? (isWinning ? "text-black/50" : "text-white/50") : "text-foreground/40"
                  }`}>
                    {song?.artist}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-foreground/40 text-xs text-center">
        Tap songs as they&apos;re called. Get 5 in a row to win!
      </p>
    </main>
  );
}
