"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Word, SafeUser, UserProgress, GroupProgress } from "@/lib/types";
import { CARD_MODES, GROUPS } from "@/lib/constants";
import Header from "@/components/Header";
import GroupSidebar from "@/components/GroupSidebar";
import FlipCard from "@/components/FlipCard";
import SearchResults from "@/components/SearchResults";

type View = "study" | "settings" | "profile" | "search";

function emptyGroupProgress(): GroupProgress {
  return { remembered: [], dontRemember: [] };
}

// ── Settings view ──────────────────────────────────────────
function SettingsView({
  modeId,
  onModeChange,
}: {
  modeId: number;
  onModeChange: (id: number) => void;
}) {
  return (
    <div className="max-w-lg">
      <h2 className="text-base sm:text-lg font-medium mb-1">Card mode</h2>
      <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">
        Choose what appears on the front and back of each flashcard.
      </p>
      <div className="flex flex-col gap-2 sm:gap-2.5">
        {CARD_MODES.map((m) => {
          const isActive = m.id === modeId;
          return (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={`text-left rounded-lg sm:rounded-xl p-3 sm:p-4 border transition-colors ${
                isActive
                  ? "bg-red-50 border-brand"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300 active:bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isActive ? "font-medium text-red-800" : "text-gray-900"}`}>
                  {m.name}
                </span>
                {isActive && (
                  <span className="text-xs text-red-700 font-medium">Active ✓</span>
                )}
              </div>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">{m.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Profile view ───────────────────────────────────────────
function ProfileView({
  user,
  onUpdate,
  onLogout,
}: {
  user: SafeUser;
  onUpdate: (u: SafeUser) => void;
  onLogout: () => void;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!name.trim()) { setError("Name can't be empty."); return; }
    if (pw && pw !== pw2) { setError("Passwords don't match."); return; }
    if (pw && pw.length < 8) { setError("Password must be at least 8 characters."); return; }
    setBusy(true); setError(""); setMessage("");

    const body: Record<string, string> = { name: name.trim(), email: email.trim() };
    if (pw) body.password = pw;

    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Update failed.");
    } else {
      onUpdate(data.user);
      setMessage("Profile saved.");
      setPw(""); setPw2("");
    }
    setBusy(false);
  };

  const inputCls = "w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-brand/40 transition-colors";

  return (
    <div className="max-w-md">
      <h2 className="text-base sm:text-lg font-medium mb-4 sm:mb-5">Profile</h2>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">New password (leave blank to keep current)</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" className={inputCls} />
        </div>
        {pw && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Confirm new password</label>
            <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="••••••••" className={inputCls} />
          </div>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-700 text-sm">{message}</p>}

        <button
          onClick={save}
          disabled={busy}
          className="h-10 rounded-lg bg-brand text-white font-medium text-sm hover:bg-brand-hover active:bg-brand-hover transition-colors disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="mt-6">
        <button onClick={onLogout} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors">
          Sign out
        </button>
      </div>
    </div>
  );
}

// ── Flashcard study view ───────────────────────────────────
function FlashcardStudyView({
  words,
  groupId,
  modeId,
  progress,
  onProgressChange,
  onNextGroup,
}: {
  words: Word[];
  groupId: number;
  modeId: number;
  progress: UserProgress;
  onProgressChange: (p: UserProgress) => void;
  onNextGroup: () => void;
}) {
  const group = GROUPS.find((g) => g.id === groupId)!;
  const [qIdx, setQIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<number[] | null>(null);

  const prog = useMemo(() => progress[groupId] || emptyGroupProgress(), [progress, groupId]);
  const remSet = useMemo(() => new Set(prog.remembered), [prog]);
  const dontSet = useMemo(() => new Set(prog.dontRemember), [prog]);
  const groupWords = useMemo(() => words.filter((w) => w.id >= group.start && w.id <= group.end), [words, group]);
  const remaining = useMemo(() => groupWords.filter((w) => !remSet.has(w.id)), [groupWords, remSet]);

  const ordered = useMemo(() => {
    if (!shuffleOrder || shuffleOrder.length !== remaining.length) return remaining;
    return shuffleOrder.map((i) => remaining[i]).filter(Boolean);
  }, [remaining, shuffleOrder]);

  useEffect(() => { setQIdx(0); setFlipped(false); setShuffleOrder(null); }, [groupId]);

  const safeIdx = ordered.length > 0 ? Math.min(qIdx, ordered.length - 1) : 0;
  const currentWord = ordered[safeIdx];

  const tick = useCallback(() => {
    if (!currentWord) return;
    const newRem = [...new Set([...prog.remembered, currentWord.id])];
    const newDont = prog.dontRemember.filter((id) => id !== currentWord.id);
    onProgressChange({ ...progress, [groupId]: { remembered: newRem, dontRemember: newDont } });
    setFlipped(false);
  }, [currentWord, prog, progress, groupId, onProgressChange]);

  const cross = useCallback(() => {
    if (!currentWord) return;
    const newDont = [...new Set([...prog.dontRemember, currentWord.id])];
    onProgressChange({ ...progress, [groupId]: { remembered: prog.remembered, dontRemember: newDont } });
    setQIdx((i) => (i + 1) % Math.max(ordered.length, 1));
    setFlipped(false);
  }, [currentWord, prog, progress, groupId, onProgressChange, ordered.length]);

  const prev = useCallback(() => {
    setQIdx((i) => (i - 1 + Math.max(ordered.length, 1)) % Math.max(ordered.length, 1));
    setFlipped(false);
  }, [ordered.length]);

  const next = useCallback(() => {
    setQIdx((i) => (i + 1) % Math.max(ordered.length, 1));
    setFlipped(false);
  }, [ordered.length]);

  const shuffle = () => {
    const arr = remaining.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffleOrder(arr); setQIdx(0); setFlipped(false);
  };

  const resetGroup = () => {
    onProgressChange({ ...progress, [groupId]: emptyGroupProgress() });
    setQIdx(0); setFlipped(false); setShuffleOrder(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === " ") { e.preventDefault(); setFlipped((f) => !f); }
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if ((e.key === "k" || e.key === "K") && flipped) tick();
      if ((e.key === "j" || e.key === "J") && flipped) cross();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, tick, cross, next, prev]);

  // All done
  if (remaining.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 max-w-md mx-auto px-4">
        <div className="text-4xl sm:text-5xl mb-4">🏆</div>
        <h2 className="text-xl sm:text-2xl font-medium mb-2">Group {group.label} complete!</h2>
        <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">
          All {groupWords.length} words marked as known.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={resetGroup} className="px-4 sm:px-5 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm hover:bg-gray-100 active:bg-gray-200 transition-colors">
            ↻ Practice again
          </button>
          {groupId < 42 && (
            <button onClick={onNextGroup} className="px-4 sm:px-5 py-2.5 rounded-lg bg-brand text-white text-sm hover:bg-brand-hover active:bg-brand-hover transition-colors">
              Next group →
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Group header bar */}
      <div className="flex justify-between items-center mb-3 sm:mb-5 flex-wrap gap-2">
        <div className="text-xs sm:text-sm text-gray-500">
          Group <span className="font-medium text-gray-900">{group.label}</span>
          <span className="text-gray-300 mx-1.5 sm:mx-2">·</span>
          {prog.remembered.length > 0 && (
            <span className="text-green-600">{prog.remembered.length} known · </span>
          )}
          <span>{remaining.length} left</span>
        </div>
        <div className="flex gap-1.5 sm:gap-2">
          <button onClick={shuffle} className="px-2 sm:px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50 text-[0.65rem] sm:text-xs text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors">
            ⇄ Shuffle
          </button>
          <button onClick={resetGroup} className="px-2 sm:px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50 text-[0.65rem] sm:text-xs text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors">
            ↻ Reset
          </button>
        </div>
      </div>

      <FlipCard
        word={currentWord}
        modeId={modeId}
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
        onTick={tick}
        onCross={cross}
        onPrev={prev}
        onNext={next}
        currentIndex={safeIdx}
        total={ordered.length}
        isReview={dontSet.has(currentWord?.id)}
      />
    </div>
  );
}

// ── Main study page ────────────────────────────────────────
export default function StudyPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [progress, setProgress] = useState<UserProgress>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("study");
  const [groupId, setGroupId] = useState(1);
  const [modeId, setModeId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"word" | "meaning" | "lau">("word");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) { router.push("/login"); return; }
      const { user: u } = await meRes.json();
      setUser(u);

      const wordsRes = await fetch("/cantonese-words.json");
      const wordsData = await wordsRes.json();
      setWords(wordsData);

      const progRes = await fetch("/api/progress");
      if (progRes.ok) {
        const { progress: p } = await progRes.json();
        setProgress(p);
      }

      const savedMode = localStorage.getItem("cf-mode");
      if (savedMode) setModeId(parseInt(savedMode));
      setLoading(false);
    })();
  }, [router]);

  const saveTimeout = useCallback(() => {
    let timer: ReturnType<typeof setTimeout>;
    return (p: UserProgress) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ progress: p }),
        });
      }, 500);
    };
  }, []);

  const debouncedSave = useMemo(() => saveTimeout(), [saveTimeout]);

  const handleProgressChange = useCallback((p: UserProgress) => {
    setProgress(p);
    debouncedSave(p);
  }, [debouncedSave]);

  const handleModeChange = (id: number) => {
    setModeId(id);
    localStorage.setItem("cf-mode", String(id));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleJumpToWord = (word: Word) => {
    setGroupId(word.group);
    setView("study");
    setSearchQuery("");
  };

  const handleNextGroup = () => { if (groupId < 42) setGroupId((g) => g + 1); };

  const activeView: View = view === "search" && !searchQuery ? "study" : view;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl font-bold text-gray-300 animate-pulse">粵語</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        user={user}
        activeView={activeView}
        onViewChange={(v) => { setView(v); if (v !== "search") setSearchQuery(""); }}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchType={searchType}
        onSearchTypeChange={setSearchType}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      <div className="flex flex-1 min-h-0 relative">
        <GroupSidebar
          activeGroupId={groupId}
          onSelect={(g) => { setGroupId(g); setView("study"); }}
          progress={progress}
          words={words}
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeView === "study" && (
            <FlashcardStudyView
              words={words}
              groupId={groupId}
              modeId={modeId}
              progress={progress}
              onProgressChange={handleProgressChange}
              onNextGroup={handleNextGroup}
            />
          )}
          {activeView === "search" && (
            <SearchResults
              words={words}
              searchQuery={searchQuery}
              searchType={searchType}
              onJumpToWord={handleJumpToWord}
            />
          )}
          {activeView === "settings" && (
            <SettingsView modeId={modeId} onModeChange={handleModeChange} />
          )}
          {activeView === "profile" && (
            <ProfileView user={user} onUpdate={setUser} onLogout={handleLogout} />
          )}
        </main>
      </div>
    </div>
  );
}
