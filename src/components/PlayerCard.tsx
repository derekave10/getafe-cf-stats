import Image from "next/image";
import Link from "next/link";
import type { SquadPlayer, PlayerTotals } from "@/lib/types";
import { positionLabel, positionColor } from "@/lib/stats";

interface PlayerCardProps {
  player: SquadPlayer;
  totals: PlayerTotals;
}

export default function PlayerCard({ player, totals }: PlayerCardProps) {
  return (
    <Link
      href={`/jugador/${player.id}`}
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style={{ background: "linear-gradient(160deg, #002E85 0%, #00215E 100%)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div
        className="relative h-52 sm:h-56 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #003CAB 0%, #00215E 100%)" }}
      >
        {player.number && (
          <span
            className="absolute top-3 left-3 z-10 leading-none tabular"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, fontSize: "3.5rem", color: "rgba(255,255,255,0.07)" }}
            aria-hidden="true"
          >
            {player.number}
          </span>
        )}
        <Image
          src={player.photo}
          alt={player.name}
          fill
          className="object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <p
              className="text-white truncate leading-tight"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: "1.1rem" }}
            >
              {player.name}
            </p>
            {player.number && (
              <p className="tabular" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, fontSize: "0.85rem", color: "#0052EB" }}>
                #{player.number}
              </p>
            )}
          </div>
          <span
            className={`shrink-0 px-2 py-0.5 rounded-full border font-medium ${positionColor(player.position)}`}
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.65rem" }}
          >
            {positionLabel(player.position)}
          </span>
        </div>

        <div
          className="grid grid-cols-4 gap-1 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Stat label="PJ" value={totals.appearances} />
          <Stat label="Goles" value={totals.goals} highlight={totals.goals > 0} />
          <Stat label="Asis." value={totals.assists} />
          <Stat label="TA" value={totals.yellowCards} warn />
        </div>
      </div>
    </Link>
  );
}

function Stat({ label, value, highlight, warn }: { label: string; value: number; highlight?: boolean; warn?: boolean }) {
  const color = warn && value > 0 ? "#F9EC2E" : highlight ? "#ffffff" : "rgba(255,255,255,0.55)";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="tabular leading-none" style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: "1.1rem", color }}>
        {value}
      </span>
      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
    </div>
  );
}
