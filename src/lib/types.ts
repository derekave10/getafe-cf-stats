export interface SquadPlayer {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: string;
  photo: string;
}

export interface CompetitionStats {
  competition: { id: number; name: string; type: string; logo: string };
  games: { appearences: number | null; lineups: number | null; minutes: number | null; position: string };
  goals: { total: number | null; assists: number | null };
  cards: { yellow: number | null; red: number | null };
}

export interface SeasonStats {
  season: number;
  competitions: CompetitionStats[];
}

export interface PlayerData {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  nationality: string;
  photo: string;
  number: number | null;
  position: string;
  seasons: SeasonStats[];
}

export interface PlayerTotals {
  appearances: number;
  minutes: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export interface PlayerTotalsByCompetition {
  [competitionName: string]: PlayerTotals;
}
