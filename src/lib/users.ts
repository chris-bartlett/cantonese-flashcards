import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import type { User, SafeUser } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SALT_ROUNDS = 12;

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readUsers(): Promise<User[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function toSafeUser(user: User): SafeUser {
  return { id: user.id, name: user.name, email: user.email };
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<SafeUser> {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.find((u) => u.email === normalizedEmail)) {
    throw new Error("An account with that email already exists.");
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);

  const user: User = {
    id: uuidv4(),
    name: name.trim(),
    email: normalizedEmail,
    hash,
    salt,
  };

  users.push(user);
  await writeUsers(users);
  return toSafeUser(user);
}

export async function verifyUser(
  email: string,
  password: string
): Promise<SafeUser | null> {
  const users = await readUsers();
  const user = users.find((u) => u.email === email.trim().toLowerCase());
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.hash);
  return valid ? toSafeUser(user) : null;
}

export async function getUserById(id: string): Promise<SafeUser | null> {
  const users = await readUsers();
  const user = users.find((u) => u.id === id);
  return user ? toSafeUser(user) : null;
}

export async function updateUser(
  id: string,
  updates: { name?: string; email?: string; password?: string }
): Promise<SafeUser | null> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  if (updates.name) users[idx].name = updates.name.trim();
  if (updates.email) users[idx].email = updates.email.trim().toLowerCase();
  if (updates.password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    users[idx].hash = await bcrypt.hash(updates.password, salt);
    users[idx].salt = salt;
  }

  await writeUsers(users);
  return toSafeUser(users[idx]);
}
