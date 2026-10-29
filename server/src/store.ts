import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Claim } from "./types.js";

const DATA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/claims.json");

export async function readClaims(): Promise<Claim[]> {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export async function writeClaims(claims: Claim[]): Promise<void> {
  await writeFile(DATA_FILE, JSON.stringify(claims, null, 2));
}
