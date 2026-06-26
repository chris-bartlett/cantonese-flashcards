"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SafeUser } from "@/lib/types";

type View = "study" | "settings" | "profile" | "search";

export default function Header({
  user,
  activeView,
  onViewChange,
  searchQuery,
  onSearchQueryChange,
  searchType,
  onSearchTypeChange,
  onToggleSidebar,
}: {
  user: SafeUser;
  activeView: View;
  onViewChange: (v: View) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  searchType: "word" | "meaning" | "lau";
  onSearchTypeChange: (t: "word" | "meaning" | "lau") => void;
  onToggleSidebar: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="h-14 flex items-center px-3 sm:px-4 gap-2 sm:gap-3 border-b border-gray-200 bg-white shrink-0 z-10">
      {/* Mobile sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Toggle groups"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 4.5h12M3 9h12M3 13.5h12" />
        </svg>
      </button>

      {/* Logo */}
      <span className="text-xl sm:text-2xl font-bold text-gray-900 select-none shrink-0">
        粵語
      </span>

      {/* Desktop search — hidden on mobile when not expanded */}
      <div className={`${searchExpanded ? "flex" : "hidden"} sm:flex items-center gap-1 sm:gap-1 flex-1 max-w-xs ${searchExpanded ? "absolute left-0 right-0 top-0 h-14 bg-white z-20 px-3 sm:relative sm:h-auto sm:px-0 sm:bg-transparent sm:z-auto" : ""}`}>
        {searchExpanded && (
          <button
            onClick={() => { setSearchExpanded(false); onSearchQueryChange(""); onViewChange("study"); }}
            className="sm:hidden w-8 h-8 flex items-center justify-center shrink-0 text-gray-500"
            aria-label="Close search"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 6L6 12M6 6l6 6"/></svg>
          </button>
        )}
        <select
          value={searchType}
          onChange={(e) => onSearchTypeChange(e.target.value as "word" | "meaning" | "lau")}
          className="h-8 bg-gray-100 border border-gray-200 rounded-md px-1.5 sm:px-2 text-xs text-gray-600 outline-none cursor-pointer shrink-0"
        >
          <option value="word">漢字</option>
          <option value="meaning">EN</option>
          <option value="lau">Lau</option>
        </select>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => { onSearchQueryChange(e.target.value); if (e.target.value) onViewChange("search"); }}
          onFocus={() => { if (searchQuery) onViewChange("search"); }}
          placeholder="Search…"
          className="h-8 flex-1 min-w-0 bg-gray-100 border border-gray-200 rounded-md px-3 text-sm text-gray-900 outline-none focus:border-brand/40 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => { onSearchQueryChange(""); onViewChange("study"); }}
            className="text-gray-400 hover:text-gray-600 text-lg px-1 shrink-0"
          >
            ×
          </button>
        )}
      </div>

      {/* Mobile search icon — shown only on mobile when search is collapsed */}
      {!searchExpanded && (
        <button
          onClick={() => setSearchExpanded(true)}
          className="sm:hidden w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Search"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>
        </button>
      )}

      <div className="flex-1" />

      {/* Nav buttons — icon-only on mobile, with labels on sm+ */}
      {(["study", "settings"] as const).map((view) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className={`h-8 px-2 sm:px-3 rounded-md text-sm flex items-center gap-1.5 transition-colors shrink-0 ${
            activeView === view
              ? "bg-gray-100 border border-gray-200 text-gray-900"
              : "border border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {view === "study" ? (
            <>
              <svg className="w-4 h-4 sm:hidden" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="12" height="12" rx="2"/><path d="M2 6h12"/></svg>
              <span className="hidden sm:inline">Study</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 sm:hidden" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="2.5"/><path d="M12.9 5.5a5.5 5.5 0 00-1.4-1.4M3.1 5.5a5.5 5.5 0 011.4-1.4M3.1 10.5a5.5 5.5 0 001.4 1.4M12.9 10.5a5.5 5.5 0 01-1.4 1.4"/></svg>
              <span className="hidden sm:inline">Modes</span>
            </>
          )}
        </button>
      ))}

      {/* User menu */}
      <div ref={menuRef} className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-8 h-8 rounded-full border border-gray-200 bg-gray-100 text-gray-900 text-sm font-medium flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          {user.name[0].toUpperCase()}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-[calc(100%+4px)] bg-white border border-gray-200 rounded-xl p-1.5 min-w-[180px] z-50 shadow-lg">
            <div className="px-3 py-2 border-b border-gray-100 mb-1">
              <div className="text-sm font-medium text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            <button
              onClick={() => { setMenuOpen(false); onViewChange("profile"); }}
              className="w-full text-left px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
