import fs from "fs/promises";
import path from "path";
import type { UserProgress } from "./types";

const PROGRESS_DIR = path.join(process.cwd(), "data", "progress");

async function ensureDir() {
  await fs.mkdir(PROGRESS_DIR, { recursive: true });
}

function filePath(userId: string) {
  // Sanitize to prevent path traversal
  const safe = userId.replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(PROGRESS_DIR, `${safe}.json`);
}

export async function getProgress(userId: string): Promise<UserProgress> {
  await ensureDir();
  try {
    const raw = await fs.readFile(filePath(userId), "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function saveProgress(
  userId: string,
  progress: UserProgress
): Promise<void> {
  await ensureDir();
  await fs.writeFile(filePath(userId), JSON.stringify(progress), "utf-8");
}
