/**
 * Fetches current squad + historical stats for Getafe CF (team 546)
 * from API-Football and saves them as JSON files in /data/
 *
 * Usage:
 *   RAPIDAPI_KEY=your_key node scripts/fetch-data.mjs
 *
 * Or set RAPIDAPI_KEY in .env.local and run via GitHub Actions.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const PLAYERS_DIR = path.join(DATA_DIR, "players");

const TEAM_ID = 546;
const API_KEY = process.env.RAPIDAPI_KEY || process.env.API_FOOTBALL_KEY;
const BASE_URL = "https://v3.football.api-sports.io";

// Seasons to fetch — from 2011 to current year
const currentYear = new Date().getFullYear();
const SEASONS = Array.from(
  { length: currentYear - 2010 },
  (_, i) => 2011 + i
);

if (!API_KEY) {
  console.error("❌ Falta la API key. Configura RAPIDAPI_KEY o API_FOOTBALL_KEY.");
  process.exit(1);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function apiFetch(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": "v3.football.api-sports.io",
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} en ${endpoint}`);
  }

  const data = await res.json();

  // Check remaining requests
  const remaining = res.headers.get("x-ratelimit-requests-remaining");
  if (remaining !== null && parseInt(remaining) < 5) {
    console.warn(`⚠️  Solo quedan ${remaining} requests hoy. Parando.`);
    process.exit(0);
  }

  return data;
}

async function fetchSquad() {
  console.log("📋 Obteniendo plantilla actual...");
  const data = await apiFetch(`/players/squads?team=${TEAM_ID}`);

  if (!data.response?.length) {
    console.error("❌ No se encontró la plantilla.");
    return [];
  }

  return data.response[0].players.map((p) => ({
    id: p.id,
    name: p.name,
    age: p.age,
    number: p.number ?? null,
    position: p.position,
    photo: p.photo,
  }));
}

async function fetchSeasonStats(season) {
  const results = [];
  let page = 1;

  while (true) {
    await sleep(1200); // Respect rate limits
    const data = await apiFetch(
      `/players?team=${TEAM_ID}&season=${season}&page=${page}`
    );

    if (!data.response?.length) break;

    for (const entry of data.response) {
      results.push({
        playerId: entry.player.id,
        playerInfo: entry.player,
        statistics: entry.statistics,
      });
    }

    const totalPages = data.paging?.total ?? 1;
    if (page >= totalPages) break;
    page++;
  }

  return results;
}

function buildPlayerFile(playerId, playerInfo, allSeasonData, squadPlayer) {
  const seasons = [];

  for (const { season, stats } of allSeasonData) {
    const playerStats = stats.find((s) => s.playerId === playerId);
    if (!playerStats) continue;

    // Only keep Getafe CF stats (team.id === 546)
    const getafeStats = playerStats.statistics.filter(
      (s) => s.team.id === TEAM_ID
    );
    if (!getafeStats.length) continue;

    seasons.push({
      season,
      competitions: getafeStats.map((s) => ({
        competition: {
          id: s.league.id,
          name: s.league.name,
          type: s.league.type,
          logo: s.league.logo,
        },
        games: {
          appearences: s.games.appearences,
          lineups: s.games.lineups,
          minutes: s.games.minutes,
          position: s.games.position,
        },
        goals: {
          total: s.goals.total,
          assists: s.goals.assists,
        },
        cards: {
          yellow: s.cards.yellow,
          red: s.cards.red,
        },
      })),
    });
  }

  return {
    id: playerId,
    name: playerInfo.name,
    firstname: playerInfo.firstname,
    lastname: playerInfo.lastname,
    age: playerInfo.age,
    nationality: playerInfo.nationality,
    photo: playerInfo.photo,
    number: squadPlayer?.number ?? null,
    position: squadPlayer?.position ?? playerInfo.position ?? "Unknown",
    seasons,
  };
}

async function main() {
  fs.mkdirSync(PLAYERS_DIR, { recursive: true });

  // 1. Get current squad
  const squad = await fetchSquad();
  console.log(`✅ Plantilla: ${squad.length} jugadores`);

  fs.writeFileSync(
    path.join(DATA_DIR, "squad.json"),
    JSON.stringify(squad, null, 2)
  );

  // 2. Fetch stats by season
  console.log(`\n📅 Obteniendo estadísticas de ${SEASONS.length} temporadas...`);
  const allSeasonData = [];

  for (const season of SEASONS) {
    process.stdout.write(`  Temporada ${season}/${season + 1}... `);
    try {
      const stats = await fetchSeasonStats(season);
      if (stats.length > 0) {
        allSeasonData.push({ season, stats });
        console.log(`${stats.length} jugadores`);
      } else {
        console.log("sin datos");
      }
    } catch (err) {
      console.log(`error: ${err.message}`);
    }
  }

  // 3. Build player JSON files (only current squad members)
  console.log("\n💾 Guardando perfiles de jugadores...");

  const squadIds = new Set(squad.map((p) => p.id));
  const playerInfoMap = new Map();

  for (const { stats } of allSeasonData) {
    for (const entry of stats) {
      if (!playerInfoMap.has(entry.playerId)) {
        playerInfoMap.set(entry.playerId, entry.playerInfo);
      }
    }
  }

  let saved = 0;
  for (const squadPlayer of squad) {
    const playerInfo = playerInfoMap.get(squadPlayer.id) ?? {
      name: squadPlayer.name,
      firstname: "",
      lastname: squadPlayer.name,
      age: squadPlayer.age,
      nationality: "",
      photo: squadPlayer.photo,
    };

    const playerFile = buildPlayerFile(
      squadPlayer.id,
      playerInfo,
      allSeasonData,
      squadPlayer
    );

    fs.writeFileSync(
      path.join(PLAYERS_DIR, `${squadPlayer.id}.json`),
      JSON.stringify(playerFile, null, 2)
    );
    saved++;
  }

  console.log(`✅ ${saved} perfiles guardados en /data/players/`);
  console.log("\n🎉 Listo. Los datos están actualizados.");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
