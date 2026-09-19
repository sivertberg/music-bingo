"use client";

import { useState, useCallback, use } from "react";
import { generateDrawSequence } from "@/lib/bingo";
import { getSong } from "@/lib/songs";

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
  const currentSong = currentNumber ? getSong(currentNumber) : null;

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
        {currentSong ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-full bg-accent flex items-center justify-center animate-pulse-glow">
              <span className="text-4xl font-bold text-white">
                {currentNumber}
              </span>
            </div>
            <div className="text-center max-w-xs">
              <p className="text-2xl font-bold text-white">{currentSong.title}</p>
              <p className="text-accent-glow text-sm">{currentSong.artist}</p>
            </div>
          </div>
        ) : (
          <div className="w-28 h-28 rounded-full bg-surface-light flex items-center justify-center border-2 border-dashed border-accent/30">
            <span className="text-foreground/40 text-lg">Ready</span>
          </div>
        )}

        <button
          onClick={drawNext}
          disabled={drawnCount >= drawSequence.length}
          className="bg-accent hover:bg-accent-glow disabled:opacity-40 text-white font-bold py-3 px-10 rounded-2xl text-lg transition-all"
        >
          {drawnCount === 0 ? "Draw First Song" : "Next Song"}
        </button>

        <p className="text-foreground/50 text-sm">
          {drawnCount} / {drawSequence.length} called
        </p>
      </div>

      {drawnNumbers.length > 0 && (
        <div className="w-full max-w-lg">
          <h2 className="text-sm font-semibold text-foreground/50 mb-2 uppercase tracking-wider">
            Called Songs
          </h2>
          <div className="flex flex-col gap-1">
            {[...drawnNumbers].reverse().map((num, i) => {
              const song = getSong(num);
              return (
                <div
                  key={num}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-lg ${
                    i === 0
                      ? "bg-accent/20 text-white"
                      : "text-foreground/50"
                  }`}
                >
                  <span className="text-xs font-mono w-6 text-right opacity-60">
                    {num}
                  </span>
                  <span className={`text-sm font-medium ${i === 0 ? "text-white" : ""}`}>
                    {song?.title}
                  </span>
                  <span className="text-xs opacity-50">
                    {song?.artist}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
