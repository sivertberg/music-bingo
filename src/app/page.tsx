"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateGameCode } from "@/lib/bingo";

export default function Home() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [mode, setMode] = useState<"initial" | "join">("initial");

  function handleHost() {
    const code = generateGameCode();
    router.push(`/host/${code}`);
  }

  function handleJoin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (joinCode.trim() && playerName.trim()) {
      router.push(
        `/play/${joinCode.trim().toUpperCase()}?name=${encodeURIComponent(playerName.trim())}`
      );
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-2">
          🎵 Music Bingo
        </h1>
        <p className="text-foreground/60 text-lg">
          The classic game, digitalized
        </p>
      </div>

      {mode === "initial" ? (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={handleHost}
            className="bg-accent hover:bg-accent-glow text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all animate-pulse-glow"
          >
            Host a Game
          </button>
          <button
            onClick={() => setMode("join")}
            className="bg-surface-light hover:bg-surface-light/80 text-foreground font-bold py-4 px-8 rounded-2xl text-xl transition-all border border-accent/30"
          >
            Join a Game
          </button>
        </div>
      ) : (
        <form onSubmit={handleJoin} className="flex flex-col gap-4 w-full max-w-xs">
          <input
            type="text"
            placeholder="Your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="bg-surface border border-accent/30 rounded-xl px-4 py-3 text-lg text-center focus:outline-none focus:border-accent"
            autoFocus
          />
          <input
            type="text"
            placeholder="Game code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={4}
            className="bg-surface border border-accent/30 rounded-xl px-4 py-3 text-2xl text-center tracking-[0.3em] uppercase focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={!joinCode.trim() || !playerName.trim()}
            className="bg-accent hover:bg-accent-glow disabled:opacity-40 disabled:hover:bg-accent text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all"
          >
            Join
          </button>
          <button
            type="button"
            onClick={() => setMode("initial")}
            className="text-foreground/50 hover:text-foreground/80 text-sm"
          >
            ← Back
          </button>
        </form>
      )}
    </main>
  );
}
