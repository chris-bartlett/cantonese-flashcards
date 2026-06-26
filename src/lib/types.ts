export interface Word {
  id: number;
  group: number;
  groupLabel: string;
  word: string | null;
  frequency: number | null;
  meaning: string | null;
  lau: string | null;
  sentences: Sentence[];
}

export interface Sentence {
  chinese: string | null;
  english: string | null;
  lau: string | null;
}

export interface Group {
  id: number;
  start: number;
  end: number;
  label: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  hash: string;
  salt: string;
}

/** What the client receives (no hash/salt) */
export interface SafeUser {
  id: string;
  name: string;
  email: string;
}

export interface GroupProgress {
  remembered: number[]; // word ids marked as known
  dontRemember: number[]; // word ids marked for review
}

export interface UserProgress {
  [groupId: string]: GroupProgress;
}

export interface CardMode {
  id: number;
  name: string;
  description: string;
  front: CardField[];
  back: CardField[];
}

export type CardField = "word" | "lau" | "meaning" | "sentences";
