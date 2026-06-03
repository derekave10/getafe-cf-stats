import fs from "fs";
import path from "path";
import type { PlayerData, SquadPlayer } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

export function getSquad(): SquadPlayer[] {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, "squad.json"), "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getPlayer(id: string): PlayerData | null {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, "players", `${id}.json`), "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAllPlayerIds(): string[] {
  try {
    return fs
      .readdirSync(path.join(DATA_DIR, "players"))
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}
