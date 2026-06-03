import Image from "next/image";
import Navbar from "@/components/Navbar";
import PositionFilter from "@/components/PositionFilter";
import { getSquad, getPlayer } from "@/lib/data";
import { computeTotals } from "@/lib/stats";
import type { PlayerTotals } from "@/lib/types";

export const revalidate = 21600;

export default function Home() {
  const squad = getSquad();

  const totalsMap: Record<number, PlayerTotals> = {};
  for (const player of squad) {
    const data = getPlayer(String(player.id));
    if (data) totalsMap[player.id] = computeTotals(data);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #00215E 0%, #001840 100%)" }}>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", textTransform: "uppercase", letterSpacing: "0.02em", color: "#ffffff", lineHeight: 1, marginBottom: "0.25rem" }}>
              Plantilla
            </h1>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.9rem", color: "rgba(255,255,255,0.5)" }}>
              Estadísticas históricas acumuladas vistiendo el azulón
            </p>
          </div>
          {squad.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(0,82,235,0.15)", border: "1px solid rgba(0,82,235,0.3)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>
                {squad.length} jugadores · Temporada 24/25
              </span>
            </div>
          )}
        </div>

        {squad.length > 0 ? (
          <PositionFilter players={squad} totalsMap={totalsMap} />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
            <Image src="/logo-getafe.png" alt="Getafe CF" width={80} height={80} className="opacity-30" />
            <p style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: "1.2rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Sin datos todavía
            </p>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "rgba(255,255,255,0.2)", maxWidth: "360px" }}>
              Ejecuta el script de carga inicial para obtener los datos de la plantilla.
            </p>
            <code style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", fontFamily: "monospace", fontSize: "0.85rem" }}>
              RAPIDAPI_KEY=tu_key node scripts/fetch-data.mjs
            </code>
          </div>
        )}
      </main>
      <footer className="text-center py-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
          Built with Claude Web Builder by{" "}
          <a href="https://tododeia.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.35)" }}>
            Tododeia
          </a>
        </p>
      </footer>
    </div>
  );
}
