import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatPill from "@/components/StatPill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPlayer, getAllPlayerIds } from "@/lib/data";
import {
  computeTotals,
  computeTotalsByCompetition,
  computeSeasonTotals,
  formatMinutes,
  positionLabel,
  positionColor,
} from "@/lib/stats";

export const revalidate = 21600;

export async function generateStaticParams() {
  return getAllPlayerIds().map((id) => ({ id }));
}

export default async function JugadorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = getPlayer(id);
  if (!player) notFound();

  const totals = computeTotals(player);
  const byCompetition = computeTotalsByCompetition(player);
  const bySeasonList = computeSeasonTotals(player);
  const competitions = Object.keys(byCompetition);
  const hasSeason = bySeasonList.length > 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #00215E 0%, #001840 100%)" }}>
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mb-8 transition-colors hover:text-white"
          style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "rgba(255,255,255,0.45)" }}
        >
          <ChevronLeft size={16} />
          Plantilla
        </Link>

        {/* Hero */}
        <div
          className="rounded-2xl overflow-hidden mb-8"
          style={{ background: "linear-gradient(135deg, #002E85 0%, #00215E 100%)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex flex-col sm:flex-row gap-0">
            <div
              className="relative sm:w-56 h-56 shrink-0"
              style={{ background: "linear-gradient(180deg, #003CAB 0%, #002E85 100%)" }}
            >
              {player.number && (
                <span
                  className="absolute bottom-2 right-3 tabular leading-none pointer-events-none"
                  style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, fontSize: "5rem", color: "rgba(255,255,255,0.06)" }}
                  aria-hidden="true"
                >
                  {player.number}
                </span>
              )}
              <Image
                src={player.photo}
                alt={player.name}
                fill
                className="object-contain object-bottom"
                priority
                sizes="(max-width: 640px) 100vw, 224px"
              />
            </div>

            <div className="flex flex-col justify-between p-6 flex-1">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${positionColor(player.position)}`}
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {positionLabel(player.position)}
                  </span>
                  {player.number && (
                    <span className="tabular" style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: "1rem", color: "#0052EB" }}>
                      #{player.number}
                    </span>
                  )}
                </div>
                <h1
                  className="text-white leading-none mb-1"
                  style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", textTransform: "uppercase" }}
                >
                  {player.name}
                </h1>
                {player.nationality && (
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
                    {player.nationality}
                  </p>
                )}
              </div>

              <div
                className="grid grid-cols-3 sm:grid-cols-6 gap-4 pt-5 mt-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <StatPill label="Partidos" value={totals.appearances} size="lg" />
                <StatPill label="Minutos" value={formatMinutes(totals.minutes)} size="lg" />
                <StatPill label="Goles" value={totals.goals} size="lg" highlight={totals.goals > 0} />
                <StatPill label="Asistencias" value={totals.assists} size="lg" />
                <StatPill label="Amarillas" value={totals.yellowCards} size="lg" />
                <StatPill label="Rojas" value={totals.redCards} size="lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {hasSeason ? (
          <Tabs defaultValue="competicion">
            <TabsList
              className="mb-6 h-auto p-1 gap-1"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <TabsTrigger
                value="competicion"
                className="px-4 py-2 rounded-lg"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, fontSize: "0.9rem" }}
              >
                Por Competición
              </TabsTrigger>
              <TabsTrigger
                value="temporada"
                className="px-4 py-2 rounded-lg"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, fontSize: "0.9rem" }}
              >
                Por Temporada
              </TabsTrigger>
            </TabsList>

            <TabsContent value="competicion">
              <div className="grid gap-3">
                {competitions.map((comp) => {
                  const s = byCompetition[comp];
                  return (
                    <div
                      key={comp}
                      className="rounded-xl px-5 py-4"
                      style={{ background: "rgba(0,46,133,0.4)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <p
                        className="mb-3 uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}
                      >
                        {comp}
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        <StatPill label="Partidos" value={s.appearances} />
                        <StatPill label="Minutos" value={formatMinutes(s.minutes)} />
                        <StatPill label="Goles" value={s.goals} highlight={s.goals > 0} />
                        <StatPill label="Asistencias" value={s.assists} />
                        <StatPill label="Amarillas" value={s.yellowCards} />
                        <StatPill label="Rojas" value={s.redCards} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="temporada">
              <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <table className="w-full min-w-[480px]" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(0,46,133,0.6)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      {["Temporada", "PJ", "Min", "Goles", "Asist.", "TA", "TR"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left"
                          style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bySeasonList.sort((a, b) => b.season - a.season).map(({ season, totals: t }, i) => (
                      <tr
                        key={season}
                        style={{
                          background: i % 2 === 0 ? "rgba(0,46,133,0.2)" : "rgba(0,33,94,0.3)",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <td className="px-4 py-3 tabular" style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: "0.95rem", color: "#ffffff" }}>
                          {season}/{String(season + 1).slice(2)}
                        </td>
                        <Td value={t.appearances} />
                        <Td value={formatMinutes(t.minutes)} />
                        <Td value={t.goals} highlight={t.goals > 0} />
                        <Td value={t.assists} />
                        <Td value={t.yellowCards} warn={t.yellowCards > 0} />
                        <Td value={t.redCards} warn={t.redCards > 0} danger />
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "rgba(0,82,235,0.15)", borderTop: "1px solid rgba(0,82,235,0.3)" }}>
                      <td className="px-4 py-3" style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, fontSize: "0.85rem", color: "#0052EB", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Total
                      </td>
                      <Td value={totals.appearances} bold />
                      <Td value={formatMinutes(totals.minutes)} bold />
                      <Td value={totals.goals} bold highlight={totals.goals > 0} />
                      <Td value={totals.assists} bold />
                      <Td value={totals.yellowCards} bold warn={totals.yellowCards > 0} />
                      <Td value={totals.redCards} bold warn={totals.redCards > 0} danger />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="rounded-xl px-6 py-10 text-center" style={{ background: "rgba(0,46,133,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.3)" }}>
              Sin estadísticas históricas disponibles para este jugador en Getafe CF.
            </p>
          </div>
        )}
      </main>

      <footer className="text-center py-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
          Built with Claude Web Builder by{" "}
          <a href="https://tododeia.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">
            Tododeia
          </a>
        </p>
      </footer>
    </div>
  );
}

function Td({ value, highlight, warn, danger, bold }: { value: number | string; highlight?: boolean; warn?: boolean; danger?: boolean; bold?: boolean }) {
  const color = danger && Number(value) > 0 ? "#D72A27" : warn && Number(value) > 0 ? "#F9EC2E" : highlight ? "#ffffff" : "rgba(255,255,255,0.6)";
  return (
    <td className="px-4 py-3 tabular" style={{ fontFamily: "var(--font-barlow)", fontWeight: bold ? 800 : 600, fontSize: "0.95rem", color }}>
      {value}
    </td>
  );
}
