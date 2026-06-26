"use client";

import type { Word } from "@/lib/types";
import CardFace from "./CardFace";
import { CARD_MODES } from "@/lib/constants";

export default function FlipCard({
  word,
  modeId,
  flipped,
  onFlip,
  onTick,
  onCross,
  onPrev,
  onNext,
  currentIndex,
  total,
  isReview,
}: {
  word: Word;
  modeId: number;
  flipped: boolean;
  onFlip: () => void;
  onTick: () => void;
  onCross: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
  isReview: boolean;
}) {
  const mode = CARD_MODES.find((m) => m.id === modeId) || CARD_MODES[0];

  return (
    <div className="max-w-xl mx-auto">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <span className="text-gray-500 text-xs">
          {currentIndex + 1} / {total} remaining
        </span>
        <div className="flex gap-2 items-center">
          {isReview && (
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Review
            </span>
          )}
          <span className="text-xs text-gray-400">#{word.id}</span>
        </div>
      </div>

      {/* 3D flip card — shorter on mobile */}
      <div
        className="cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={onFlip}
      >
        <div
          className="relative transition-transform duration-500 h-[280px] sm:h-[340px] md:h-[380px]"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-xl border border-gray-200 bg-white overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <CardFace fields={mode.front} word={word} isFront={true} />
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-xl border border-brand/30 bg-gray-50 overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardFace fields={mode.back} word={word} isFront={false} />
          </div>
        </div>
      </div>

      {/* Controls — larger touch targets on mobile */}
      <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-5 items-center">
        <button
          onClick={onPrev}
          className="px-2.5 sm:px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-xs sm:text-sm hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          ←<span className="hidden sm:inline"> Prev</span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onCross(); }}
          title="Keep reviewing"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-red-200 bg-red-50 text-red-600 text-lg flex items-center justify-center hover:bg-red-100 active:bg-red-200 transition-colors"
        >
          ✕
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onTick(); }}
          title="Mark as known"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-green-200 bg-green-50 text-green-600 text-lg flex items-center justify-center hover:bg-green-100 active:bg-green-200 transition-colors"
        >
          ✓
        </button>

        <button
          onClick={onNext}
          className="px-2.5 sm:px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-xs sm:text-sm hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <span className="hidden sm:inline">Next </span>→
        </button>
      </div>

      {/* Keyboard hint — hidden on mobile (no keyboard) */}
      <p className="hidden sm:block text-center text-gray-400 text-[0.65rem] mt-2.5">
        <kbd className="px-1 py-0.5 border border-gray-200 rounded text-[0.6rem]">space</kbd> flip ·{" "}
        <kbd className="px-1 py-0.5 border border-gray-200 rounded text-[0.6rem]">← →</kbd> navigate ·{" "}
        <kbd className="px-1 py-0.5 border border-gray-200 rounded text-[0.6rem]">k</kbd> know ·{" "}
        <kbd className="px-1 py-0.5 border border-gray-200 rounded text-[0.6rem]">j</kbd> skip
      </p>

      {/* Mobile tap hint */}
      <p className="sm:hidden text-center text-gray-400 text-[0.65rem] mt-2">
        Tap card to flip · swipe buttons to rate
      </p>
    </div>
  );
}
