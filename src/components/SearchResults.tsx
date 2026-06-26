"use client";

import { useMemo } from "react";
import type { Word } from "@/lib/types";
import LauText from "./LauText";

export default function SearchResults({
  words,
  searchQuery,
  searchType,
  onJumpToWord,
}: {
  words: Word[];
  searchQuery: string;
  searchType: "word" | "meaning" | "lau";
  onJumpToWord: (word: Word) => void;
}) {
  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return words
      .filter((w) => {
        if (searchType === "word") return w.word?.includes(searchQuery.trim());
        if (searchType === "meaning") return w.meaning?.toLowerCase().includes(q);
        if (searchType === "lau") return w.lau?.toLowerCase().includes(q);
        return false;
      })
      .slice(0, 60);
  }, [words, searchQuery, searchType]);

  if (!searchQuery.trim()) {
    return (
      <p className="text-gray-400 py-4 text-sm">
        Type in the search box to find words.
      </p>
    );
  }

  return (
    <div>
      <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
        {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
        {results.length === 60 ? " (showing first 60)" : ""}
      </p>

      <div className="flex flex-col gap-1.5 sm:gap-2">
        {results.map((w) => (
          <button
            key={w.id}
            onClick={() => onJumpToWord(w)}
            className="bg-white border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-5 py-2.5 sm:py-3 cursor-pointer flex items-center gap-3 sm:gap-4 transition-colors hover:border-gray-400 active:bg-gray-50 text-left w-full"
          >
            <span className="text-3xl sm:text-4xl text-gray-900 min-w-[2.5rem] sm:min-w-[3rem] text-center leading-none">
              {w.word}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-amber-600 text-xs sm:text-sm mb-0.5">
                <LauText text={w.lau} />
              </div>
              <div className="text-gray-500 text-xs sm:text-sm truncate">{w.meaning}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-gray-400 text-[0.6rem] sm:text-[0.65rem]">#{w.id}</div>
              <div className="text-gray-400 text-[0.6rem] sm:text-[0.65rem]">{w.groupLabel}</div>
            </div>
          </button>
        ))}

        {results.length === 0 && searchQuery && (
          <p className="text-gray-400 text-center py-8 text-sm">No results found.</p>
        )}
      </div>
    </div>
  );
}
