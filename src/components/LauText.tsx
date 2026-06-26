"use client";

import React from "react";

/**
 * Renders Sidney Lau romanisation with tone numbers as superscript.
 * e.g. "ngoh5 ji1" → ngoh⁵ ji¹
 */
export default function LauText({
  text,
  className = "",
}: {
  text: string | null | undefined;
  className?: string;
}) {
  if (!text) return null;

  // Split on boundaries around syllable+tone patterns
  const parts = text.split(/([a-zA-Z*]+[1-6])/g);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const match = part.match(/^([a-zA-Z*]+)([1-6])$/);
        if (match) {
          return (
            <span key={i}>
              {match[1]}
              <sup className="text-[0.6em] align-super leading-none">
                {match[2]}
              </sup>
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
