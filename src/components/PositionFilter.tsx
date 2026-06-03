"use client";

import { useState } from "react";
import type { SquadPlayer, PlayerTotals } from "@/lib/types";
import PlayerCard from "./PlayerCard";
import { positionLabel } from "@/lib/stats";

const POSITIONS = ["Todos", "Goalkeeper", "Defender", "Midfielder", "Attacker"];

interface PositionFilterProps {
  players: SquadPlayer[];
  totalsMap: Record<number, PlayerTotals>;
}

export default function PositionFilter({ players, totalsMap }: PositionFilterProps) {
  const [active, setActive] = useState("Todos");
  const filtered = active === "Todos" ? players : players.filter((p) => p.position === active);

  return (
    <div>
      <div role="group" aria-label="Filtrar por posición" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
        {POSITIONS.map((pos) => {
          const isActive = pos === active;
          const count = pos === "Todos" ? players.length : players.filter((p) => p.position === pos).length;
          return (
            <button
              key={pos}
              onClick={() => setActive(pos)}
              aria-pressed={isActive}
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 600,
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
                padding: "0.375rem 1rem",
                borderRadius: "9999px",
                border: isActive ? "1px solid #0052EB" : "1px solid rgba(255,255,255,0.1)",
                background: isActive ? "#0052EB" : "rgba(255,255,255,0.07)",
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {pos === "Todos" ? "Todos" : positionLabel(pos)}
              <span style={{ marginLeft: "0.375rem", opacity: 0.6, fontSize: "0.75rem" }}>{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "4rem 0" }}>
          No hay jugadores en esta posición.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
          {filtered.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              totals={totalsMap[player.id] ?? { appearances: 0, minutes: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
