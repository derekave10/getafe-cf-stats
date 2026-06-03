import type { PlayerData, PlayerTotals, PlayerTotalsByCompetition } from "./types";

export function computeTotals(player: PlayerData): PlayerTotals {
  const totals: PlayerTotals = {
    appearances: 0,
    minutes: 0,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
  };

  for (const season of player.seasons) {
    for (const comp of season.competitions) {
      totals.appearances += comp.games.appearences ?? 0;
      totals.minutes += comp.games.minutes ?? 0;
      totals.goals += comp.goals.total ?? 0;
      totals.assists += comp.goals.assists ?? 0;
      totals.yellowCards += comp.cards.yellow ?? 0;
      totals.redCards += comp.cards.red ?? 0;
    }
  }

  return totals;
}

export function computeTotalsByCompetition(player: PlayerData): PlayerTotalsByCompetition {
  const byComp: PlayerTotalsByCompetition = {};

  for (const season of player.seasons) {
    for (const comp of season.competitions) {
      const name = comp.competition.name;
      if (!byComp[name]) {
        byComp[name] = { appearances: 0, minutes: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 };
      }
      byComp[name].appearances += comp.games.appearences ?? 0;
      byComp[name].minutes += comp.games.minutes ?? 0;
      byComp[name].goals += comp.goals.total ?? 0;
      byComp[name].assists += comp.goals.assists ?? 0;
      byComp[name].yellowCards += comp.cards.yellow ?? 0;
      byComp[name].redCards += comp.cards.red ?? 0;
    }
  }

  return byComp;
}

export function computeSeasonTotals(player: PlayerData) {
  return player.seasons.map((season) => {
    const totals: PlayerTotals = { appearances: 0, minutes: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 };
    for (const comp of season.competitions) {
      totals.appearances += comp.games.appearences ?? 0;
      totals.minutes += comp.games.minutes ?? 0;
      totals.goals += comp.goals.total ?? 0;
      totals.assists += comp.goals.assists ?? 0;
      totals.yellowCards += comp.cards.yellow ?? 0;
      totals.redCards += comp.cards.red ?? 0;
    }
    return { season: season.season, totals };
  });
}

export function formatMinutes(minutes: number): string {
  if (minutes === 0) return "0'";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}'`;
  return `${h}h ${m}'`;
}

export function positionLabel(pos: string): string {
  const map: Record<string, string> = {
    Goalkeeper: "Portero",
    Defender: "Defensa",
    Midfielder: "Centrocampista",
    Attacker: "Delantero",
  };
  return map[pos] ?? pos;
}

export function positionColor(pos: string): string {
  const map: Record<string, string> = {
    Goalkeeper: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Defender: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Midfielder: "bg-green-500/20 text-green-400 border-green-500/30",
    Attacker: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return map[pos] ?? "bg-white/10 text-white/70 border-white/20";
}
