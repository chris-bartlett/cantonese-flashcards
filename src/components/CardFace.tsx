"use client";

import type { Word, CardField } from "@/lib/types";
import LauText from "./LauText";

export default function CardFace({
  fields,
  word,
  isFront,
}: {
  fields: CardField[];
  word: Word;
  isFront: boolean;
}) {
  const hasWord = fields.includes("word");
  const hasLau = fields.includes("lau");
  const hasMeaning = fields.includes("meaning");
  const hasSentences = fields.includes("sentences");
  const isCentered = isFront || (fields.length <= 2 && !hasSentences);

  return (
    <div
      className={`h-full p-4 sm:p-6 flex flex-col overflow-y-auto gap-2 sm:gap-3 ${
        isCentered ? "items-center justify-center" : "items-start justify-start"
      }`}
    >
      {hasWord && (
        <div className="text-center">
          <span
            className={`font-bold text-gray-900 leading-tight block ${
              hasMeaning || hasLau
                ? "text-4xl sm:text-5xl"
                : "text-5xl sm:text-7xl"
            }`}
          >
            {word.word}
          </span>
        </div>
      )}

      {hasLau && (
        <div className="text-center">
          <LauText
            text={word.lau}
            className="text-lg sm:text-xl text-amber-700 font-medium"
          />
        </div>
      )}

      {hasMeaning && (
        <p
          className={`text-gray-800 text-sm sm:text-base leading-relaxed ${
            isCentered ? "text-center" : ""
          } ${!hasWord && !hasLau ? "text-xl sm:text-2xl font-medium" : ""}`}
        >
          {word.meaning}
        </p>
      )}

      {hasSentences && word.sentences.length > 0 && (
        <div className="w-full flex flex-col gap-1.5 sm:gap-2 mt-1">
          {word.sentences.map((s, i) =>
            s ? (
              <div
                key={i}
                className="bg-gray-50 rounded-lg p-2.5 sm:p-3 border-l-2 border-amber-500"
              >
                {s.chinese && (
                  <p className="text-gray-900 text-xs sm:text-sm mb-0.5">{s.chinese}</p>
                )}
                {s.english && (
                  <p className="text-gray-500 text-[0.65rem] sm:text-xs mb-0.5">{s.english}</p>
                )}
                {s.lau && (
                  <LauText text={s.lau} className="text-[0.65rem] sm:text-xs text-amber-600" />
                )}
              </div>
            ) : null
          )}
        </div>
      )}

      {isFront && (
        <p className="text-gray-400 text-[0.6rem] sm:text-xs mt-auto pt-3 sm:pt-4">
          <span className="hidden sm:inline">Click to flip · space bar</span>
          <span className="sm:hidden">Tap to flip</span>
        </p>
      )}
    </div>
  );
}
