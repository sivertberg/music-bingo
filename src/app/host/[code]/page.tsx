"use client";

import { useState, useCallback, use } from "react";
import { generateDrawSequence } from "@/lib/bingo";

export default function HostPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const [drawSequence] = useState(() => generateDrawSequence(code));
  const [drawnCount, setDrawnCount] = useState(0);

  const drawnNumbers = drawSequence.slice(0, drawnCount);
  const currentNumber = drawnCount > 0 ? drawSequence[drawnCount - 1] : null;

  const drawNext = useCallback(() => {
    if (drawnCount < drawSequence.length) {
      setDrawnCount((prev) => prev + 1);
    }
  }, [drawnCount, drawSequence.length]);

  return (
    <main className="flex-1 flex flex-col items-center p-6 gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-1">🎵 Music Bingo</h1>
        <div className="flex items-center justify-center gap-2">
          <span className="text-foreground/60">Game Code:</span>
          <span className="text-2xl font-mono font-bold tracking-[0.2em] text-accent-glow">
            {code}
          </span>
        </div>
        <p className="text-foreground/40 text-sm mt-1">
          Share this code with players
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        {currentNumber !== null ? (
          <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center animate-pulse-glow">
            <span className="text-5xl font-bold text-white">
              {currentNumber}
            </span>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-surface-light flex items-center justify-center border-2 border-dashed border-accent/30">
            <span className="text-foreground/40 text-lg">Ready</span>
          </div>
        )}

        <button
          onClick={drawNext}
          disabled={drawnCount >= drawSequence.length}
          className="bg-accent hover:bg-accent-glow disabled:opacity-40 text-white font-bold py-3 px-10 rounded-2xl text-lg transition-all"
        >
          {drawnCount === 0 ? "Draw First Number" : "Draw Next"}
        </button>

        <p className="text-foreground/50 text-sm">
          {drawnCount} / {drawSequence.length} drawn
        </p>
      </div>

      {drawnNumbers.length > 0 && (
        <div className="w-full max-w-lg">
          <h2 className="text-sm font-semibold text-foreground/50 mb-2 uppercase tracking-wider">
            Called Numbers
          </h2>
          <div className="flex flex-wrap gap-2">
            {drawnNumbers.map((num, i) => (
              <span
                key={num}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                  i === drawnNumbers.length - 1
                    ? "bg-accent text-white"
                    : "bg-surface-light text-foreground/70"
                }`}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
