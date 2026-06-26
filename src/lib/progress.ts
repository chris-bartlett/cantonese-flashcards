import type { UserProgress } from "./types";
import { getStorage } from "./storage";

const store = getStorage("progress");

export async function getProgress(userId: string): Promise<UserProgress> {
  const raw = await store.get(userId);
  return raw ? JSON.parse(raw) : {};
}

export async function saveProgress(
  userId: string,
  progress: UserProgress
): Promise<void> {
  await store.set(userId, JSON.stringify(progress));
}
