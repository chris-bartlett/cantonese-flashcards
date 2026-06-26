import type { CardMode } from "./types";

export const CARD_MODES: CardMode[] = [
  {
    id: 1,
    name: "Chinese → All",
    description: "Chinese character on front. Meaning, Lau romanisation and example sentences on back.",
    front: ["word"],
    back: ["meaning", "lau", "sentences"],
  },
  {
    id: 2,
    name: "Chinese + Lau → Meaning",
    description: "Character and pronunciation on front. English meaning and example sentences on back.",
    front: ["word", "lau"],
    back: ["meaning", "sentences"],
  },
  {
    id: 3,
    name: "English → Chinese",
    description: "English meaning on front. Chinese character, Lau romanisation and examples on back.",
    front: ["meaning"],
    back: ["word", "lau", "sentences"],
  },
  {
    id: 4,
    name: "Chinese + Meaning → Lau",
    description: "Character and meaning on front. Just Lau pronunciation and examples on back.",
    front: ["word", "meaning"],
    back: ["lau", "sentences"],
  },
  {
    id: 5,
    name: "Chinese + Lau → English",
    description: "Character and Lau on front. English meaning and example sentences on back.",
    front: ["word", "lau"],
    back: ["meaning", "sentences"],
  },
];

export const GROUPS = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  start: i * 50 + 1,
  end: Math.min(i * 50 + 50, 2099),
  label: `${i * 50 + 1}–${Math.min(i * 50 + 50, 2099)}`,
}));
