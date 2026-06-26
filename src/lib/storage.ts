import fs from "fs/promises";
import path from "path";

/**
 * Simple key-value store interface.
 * Backed by local filesystem in dev, Netlify Blobs in production.
 */
export interface KVStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

// ── Detection ──────────────────────────────────────────────

const IS_NETLIFY =
  process.env.NETLIFY === "true" || !!process.env.NETLIFY_BLOBS_CONTEXT;

// ── File-based store (local dev) ───────────────────────────

function sanitizeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, "");
}

function createFileStore(namespace: string): KVStore {
  const dir = path.join(process.cwd(), "data", namespace);

  const ensureDir = async () => {
    await fs.mkdir(dir, { recursive: true });
  };

  return {
    async get(key) {
      await ensureDir();
      try {
        return await fs.readFile(
          path.join(dir, `${sanitizeKey(key)}.json`),
          "utf-8"
        );
      } catch {
        return null;
      }
    },

    async set(key, value) {
      await ensureDir();
      await fs.writeFile(
        path.join(dir, `${sanitizeKey(key)}.json`),
        value,
        "utf-8"
      );
    },

    async delete(key) {
      try {
        await fs.unlink(path.join(dir, `${sanitizeKey(key)}.json`));
      } catch {
        // Key didn't exist — that's fine
      }
    },
  };
}

// ── Netlify Blobs store (production) ───────────────────────

function createNetlifyStore(namespace: string): KVStore {
  // Dynamic import so the package isn't required at all in local dev
  const getStoreRef = async () => {
    const { getStore } = await import("@netlify/blobs");
    return getStore(namespace);
  };

  return {
    async get(key) {
      const store = await getStoreRef();
      const value = await store.get(sanitizeKey(key), { type: "text" });
      return value ?? null;
    },

    async set(key, value) {
      const store = await getStoreRef();
      await store.set(sanitizeKey(key), value);
    },

    async delete(key) {
      const store = await getStoreRef();
      await store.delete(sanitizeKey(key));
    },
  };
}

// ── Public API ─────────────────────────────────────────────

/**
 * Returns a namespaced key-value store.
 *
 * - Local dev (`npm run dev`): reads/writes JSON files under `data/<namespace>/`
 * - Netlify prod / `netlify dev`: uses Netlify Blobs
 */
export function getStorage(namespace: string): KVStore {
  if (IS_NETLIFY) {
    return createNetlifyStore(namespace);
  }
  return createFileStore(namespace);
}
