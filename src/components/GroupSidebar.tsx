"use client";

import { useEffect } from "react";
import type { Word, UserProgress } from "@/lib/types";
import { GROUPS } from "@/lib/constants";

export default function GroupSidebar({
  activeGroupId,
  onSelect,
  progress,
  words,
  mobileOpen,
  onMobileClose,
}: {
  activeGroupId: number;
  onSelect: (groupId: number) => void;
  progress: UserProgress;
  words: Word[];
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const sidebar = (
    <div className={`
      flex flex-col bg-gray-50/95 backdrop-blur-sm overflow-hidden
      fixed inset-y-0 left-0 z-40 w-64 shadow-xl transition-transform duration-300 ease-in-out
      lg:relative lg:z-auto lg:w-52 lg:shadow-none lg:translate-x-0 lg:border-r lg:border-gray-200
      ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      {/* Mobile header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 lg:justify-start">
        <span className="text-[0.65rem] font-medium text-gray-400 uppercase tracking-widest">
          Word groups
        </span>
        <button
          onClick={onMobileClose}
          className="lg:hidden w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
          aria-label="Close sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 4L4 12M4 4l8 8"/></svg>
        </button>
      </div>

      {/* Group list */}
      <div className="flex-1 overflow-y-auto">
        {GROUPS.map((g) => {
          const groupProg = progress[g.id] || { remembered: [], dontRemember: [] };
          const total = words.filter((w) => w.id >= g.start && w.id <= g.end).length;
          const pct = total > 0 ? Math.round((groupProg.remembered.length / total) * 100) : 0;
          const isActive = g.id === activeGroupId;

          return (
            <button
              key={g.id}
              onClick={() => { onSelect(g.id); onMobileClose(); }}
              className={`w-full text-left px-4 py-2.5 lg:py-2 border-l-2 transition-colors ${
                isActive
                  ? "border-l-brand bg-white"
                  : "border-l-transparent hover:bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-baseline">
                <span className={`text-sm ${isActive ? "font-medium text-gray-900" : "text-gray-600"}`}>
                  {g.label}
                </span>
                {groupProg.remembered.length > 0 && (
                  <span className={`text-[0.6rem] ${pct === 100 ? "text-green-600" : "text-amber-600"}`}>
                    {pct}%
                  </span>
                )}
              </div>
              {pct > 0 && (
                <div className="mt-1 h-0.5 bg-gray-200 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${pct === 100 ? "bg-green-500" : "bg-amber-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      {sidebar}
    </>
  );
}
