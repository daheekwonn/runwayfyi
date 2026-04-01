"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Show {
  id: number;
  brand: string;
  city: string;
  slug: string;
  total_looks?: number;
}

interface Look {
  id: number;
  look_number: number;
  image_url: string;
  manual_tags?: string;
}

type SuggestState = "idle" | "loading" | "done" | "error";

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = "https://fashion-backend-production-6880.up.railway.app";
const CITIES = ["All", "Paris", "Milan", "London", "New York", "Copenhagen", "Berlin", "Tokyo"];
const ADMIN_PW = "Runw3825!";

// ─── AI Tag Suggestion ────────────────────────────────────────────────────────

async function getSuggestedTags(imageUrl: string): Promise<string[]> {
  const prompt = `You are tagging runway looks for a fashion trend intelligence platform.
Analyse this runway image carefully and return specific, descriptive fashion tags.

Good examples of tag style: "croc effect leather", "strong shoulder", "waxed denim", "wide-leg trouser", "pumps", "long scarf", "leather gloves", "grey denim", "brown handbag", "mini skirt", "denim set"

Tags should cover: silhouette details, key garments, fabric/texture/finish, colour, accessories, construction details.
- Be specific and descriptive, not vague ("croc effect leather" not just "leather")
- All lowercase
- 6–10 tags total

Return ONLY a comma-separated list of tags. No explanation, no preamble.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "url", url: imageUrl } },
          { type: "text", text: prompt },
        ],
      }],
    }),
  });

  if (!response.ok) throw new Error(`API ${response.status}`);
  const data = await response.json();
  const text = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";
  return text
    .split(",")
    .map((t: string) => t.trim().toLowerCase().replace(/^["']|["']$/g, ""))
    .filter((t: string) => t.length > 0 && t.length < 60);
}

// ─── Auth Gate ────────────────────────────────────────────────────────────────

function AuthGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  function attempt() {
    if (pw === ADMIN_PW) onAuth();
    else setErr(true);
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0a0a0a", fontFamily: "'DM Mono', monospace",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <span style={{ color: "#444", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          runway fyi · admin
        </span>
        <input
          type="password"
          placeholder="password"
          autoFocus
          value={pw}
          onChange={e => { setPw(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          style={{
            background: "transparent",
            border: `1px solid ${err ? "#c03" : "#2a2a2a"}`,
            color: "#ccc", padding: "10px 14px", fontSize: 12,
            outline: "none", fontFamily: "inherit", width: 220, borderRadius: 3,
          }}
        />
        {err && <span style={{ color: "#c03", fontSize: 10 }}>incorrect</span>}
      </div>
    </div>
  );
}

// ─── Tag Chip ─────────────────────────────────────────────────────────────────

function TagChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      background: "#161616", border: "1px solid #222",
      color: "#bbb", fontSize: 10, padding: "2px 6px 2px 8px",
      borderRadius: 2, fontFamily: "'DM Mono', monospace", lineHeight: 1.6,
    }}>
      {label}
      <button
        onClick={onRemove}
        style={{
          background: "none", border: "none", color: "#444", cursor: "pointer",
          fontSize: 12, lineHeight: 1, padding: "0 0 1px", display: "flex",
        }}
      >×</button>
    </span>
  );
}

// ─── Look Card ────────────────────────────────────────────────────────────────

function LookCard({
  look, tags, onTagsChange, onSuggest, suggestState,
  suggestedTags, onAcceptSuggested, onDismissSuggested, isDirty,
}: {
  look: Look;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  onSuggest: () => void;
  suggestState: SuggestState;
  suggestedTags: string[];  // already filtered for dismissed + already-accepted
  onAcceptSuggested: (tag: string) => void;
  onDismissSuggested: (tag: string) => void;
  isDirty: boolean;
}) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase();
    if (tag && !tags.includes(tag)) onTagsChange([...tags, tag]);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  }

  return (
    <div style={{
      background: "#0d0d0d",
      border: `1px solid ${isDirty ? "#1e301e" : "#161616"}`,
      borderRadius: 5, overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "2/3", background: "#111", flexShrink: 0 }}>
        {look.image_url ? (
          <img
            src={look.image_url}
            alt={`Look ${look.look_number}`}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#2a2a2a", fontSize: 10 }}>no image</span>
          </div>
        )}
        {/* Look number */}
        <span style={{
          position: "absolute", top: 6, left: 6,
          background: "rgba(0,0,0,0.7)", color: "#666", fontSize: 9,
          padding: "2px 5px", borderRadius: 2, fontFamily: "'DM Mono', monospace",
        }}>
          {look.look_number}
        </span>
        {/* Unsaved dot */}
        {isDirty && (
          <span style={{
            position: "absolute", top: 8, right: 8,
            width: 5, height: 5, borderRadius: "50%", background: "#4a8",
          }} />
        )}
      </div>

      {/* Tag area */}
      <div style={{ padding: "8px 9px 9px", display: "flex", flexDirection: "column", gap: 7 }}>

        {/* Accepted tags */}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {tags.map(tag => (
              <TagChip key={tag} label={tag} onRemove={() => onTagsChange(tags.filter(t => t !== tag))} />
            ))}
          </div>
        )}

        {/* Free-type input */}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input.trim()) addTag(input); }}
          placeholder={tags.length === 0 ? "type tag, enter to add…" : "add more…"}
          style={{
            background: "transparent", border: "none",
            borderBottom: "1px solid #1e1e1e", color: "#888",
            fontSize: 10, padding: "3px 0", outline: "none",
            fontFamily: "'DM Mono', monospace", width: "100%",
          }}
        />

        {/* AI suggest button */}
        {suggestState === "idle" && (
          <button
            onClick={onSuggest}
            style={{
              background: "none", border: "1px solid #1e1e1e", borderRadius: 2,
              color: "#444", fontSize: 9, padding: "4px 7px", cursor: "pointer",
              fontFamily: "inherit", letterSpacing: "0.06em", textAlign: "left",
            }}
          >
            ✦ suggest from image
          </button>
        )}

        {suggestState === "loading" && (
          <span style={{ color: "#333", fontSize: 9, fontFamily: "'DM Mono', monospace" }}>
            analysing image…
          </span>
        )}

        {suggestState === "error" && (
          <span style={{ color: "#522", fontSize: 9, fontFamily: "'DM Mono', monospace" }}>
            couldn't load — try again
          </span>
        )}

        {/* Pending suggestions */}
        {suggestState === "done" && suggestedTags.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 8, color: "#333", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              suggestions
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {suggestedTags.map(tag => (
                <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                  <button
                    onClick={() => onAcceptSuggested(tag)}
                    style={{
                      background: "none", border: "1px dashed #1e3a1e",
                      color: "#3a7", fontSize: 9, padding: "2px 6px",
                      borderRadius: 2, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    + {tag}
                  </button>
                  <button
                    onClick={() => onDismissSuggested(tag)}
                    style={{
                      background: "none", border: "none", color: "#2a2a2a",
                      fontSize: 11, cursor: "pointer", lineHeight: 1, padding: 0,
                    }}
                  >×</button>
                </span>
              ))}
            </div>
            <button
              onClick={() => suggestedTags.forEach(t => onAcceptSuggested(t))}
              style={{
                background: "none", border: "none", color: "#3a7",
                fontSize: 9, cursor: "pointer", textAlign: "left",
                fontFamily: "inherit", padding: 0, letterSpacing: "0.04em",
              }}
            >
              accept all →
            </button>
          </div>
        )}

        {suggestState === "done" && suggestedTags.length === 0 && (
          <span style={{ color: "#2a2a2a", fontSize: 9 }}>all suggestions accepted</span>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TagLooksPage() {
  const [authed, setAuthed] = useState(false);

  const [shows, setShows] = useState<Show[]>([]);
  const [cityFilter, setCityFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);

  const [looks, setLooks] = useState<Look[]>([]);
  const [loadingLooks, setLoadingLooks] = useState(false);

  // per-look tag state
  const [tagMap, setTagMap] = useState<Record<number, string[]>>({});
  const [dirtySet, setDirtySet] = useState<Set<number>>(new Set());
  const [suggestStateMap, setSuggestStateMap] = useState<Record<number, SuggestState>>({});
  const [suggestedTagsMap, setSuggestedTagsMap] = useState<Record<number, string[]>>({});
  const [dismissedMap, setDismissedMap] = useState<Record<number, Set<string>>>({});

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"" | "saved" | "error">("");

  // ── Load shows ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!authed) return;
    fetch(`${API_BASE}/api/trends/shows`)
      .then(r => r.json())
      .then(data => setShows(Array.isArray(data) ? data : data.shows ?? []))
      .catch(console.error);
  }, [authed]);

  // ── Load looks on show select ──────────────────────────────────────────────

  useEffect(() => {
    if (!selectedShow) return;
    setLoadingLooks(true);
    setLooks([]);
    setTagMap({});
    setDirtySet(new Set());
    setSuggestStateMap({});
    setSuggestedTagsMap({});
    setDismissedMap({});

    fetch(`${API_BASE}/api/trends/shows/${selectedShow.id}/looks`)
      .then(r => r.json())
      .then(data => {
        const arr: Look[] = Array.isArray(data) ? data : data.looks ?? [];
        setLooks(arr);
        const init: Record<number, string[]> = {};
        arr.forEach(l => {
          init[l.id] = l.manual_tags
            ? l.manual_tags.split(",").map(t => t.trim()).filter(Boolean)
            : [];
        });
        setTagMap(init);
      })
      .catch(console.error)
      .finally(() => setLoadingLooks(false));
  }, [selectedShow]);

  // ── Tag helpers ────────────────────────────────────────────────────────────

  function setLookTags(lookId: number, tags: string[]) {
    setTagMap(prev => ({ ...prev, [lookId]: tags }));
    setDirtySet(prev => new Set([...prev, lookId]));
  }

  // ── AI suggest single look ─────────────────────────────────────────────────

  async function handleSuggest(look: Look) {
    if (!look.image_url) return;
    setSuggestStateMap(prev => ({ ...prev, [look.id]: "loading" }));
    try {
      const tags = await getSuggestedTags(look.image_url);
      setSuggestedTagsMap(prev => ({ ...prev, [look.id]: tags }));
      setSuggestStateMap(prev => ({ ...prev, [look.id]: "done" }));
    } catch {
      setSuggestStateMap(prev => ({ ...prev, [look.id]: "error" }));
    }
  }

  // ── Suggest all untagged ───────────────────────────────────────────────────

  async function suggestAll() {
    const toSuggest = looks.filter(l => {
      const hasTags = (tagMap[l.id]?.length ?? 0) > 0;
      const state = suggestStateMap[l.id];
      return !hasTags && state !== "loading" && state !== "done" && l.image_url;
    });
    for (const look of toSuggest) {
      await handleSuggest(look);
      await new Promise(r => setTimeout(r, 350)); // gentle rate limiting
    }
  }

  // ── Accept / dismiss suggestions ──────────────────────────────────────────

  function handleAcceptSuggested(lookId: number, tag: string) {
    setLookTags(lookId, [...(tagMap[lookId] ?? []), tag]);
  }

  function handleDismissSuggested(lookId: number, tag: string) {
    setDismissedMap(prev => {
      const s = new Set(prev[lookId] ?? []);
      s.add(tag);
      return { ...prev, [lookId]: s };
    });
  }

  function getVisibleSuggestions(lookId: number): string[] {
    const all = suggestedTagsMap[lookId] ?? [];
    const dismissed = dismissedMap[lookId] ?? new Set<string>();
    const accepted = new Set(tagMap[lookId] ?? []);
    return all.filter(t => !dismissed.has(t) && !accepted.has(t));
  }

  // ── Save all dirty ─────────────────────────────────────────────────────────

  async function saveAll() {
    if (!selectedShow || dirtySet.size === 0) return;
    setSaving(true);
    setSaveStatus("");
    const dirtyLooks = looks.filter(l => dirtySet.has(l.id));
    try {
      await Promise.all(
        dirtyLooks.map(l =>
          fetch(`${API_BASE}/api/trends/shows/${selectedShow.id}/looks/${l.id}/manual-tags`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ manual_tags: (tagMap[l.id] ?? []).join(", ") }),
          })
        )
      );
      setDirtySet(new Set());
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  // ── Filtered shows ─────────────────────────────────────────────────────────

  const filteredShows = shows.filter(s => {
    const matchCity = cityFilter === "All" || s.city === cityFilter;
    const matchSearch = s.brand.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSearch;
  });

  const taggedCount = looks.filter(l => (tagMap[l.id]?.length ?? 0) > 0).length;
  const progress = looks.length > 0 ? Math.round((taggedCount / looks.length) * 100) : 0;

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!authed) return <AuthGate onAuth={() => setAuthed(true)} />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #0a0a0a; height: 100%; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 2px; }
      `}</style>

      <div style={{
        display: "flex", height: "100vh", overflow: "hidden",
        fontFamily: "'DM Mono', monospace", background: "#0a0a0a", color: "#ccc",
      }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: 230, borderRight: "1px solid #141414", display: "flex",
          flexDirection: "column", flexShrink: 0, height: "100vh",
        }}>
          <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid #141414" }}>
            <div style={{ fontSize: 9, color: "#333", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
              runway fyi · tag looks
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="search…"
              style={{
                width: "100%", background: "#0f0f0f", border: "1px solid #1a1a1a",
                color: "#888", padding: "5px 9px", fontSize: 10, borderRadius: 2,
                outline: "none", fontFamily: "inherit",
              }}
            />
          </div>

          {/* City chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, padding: "8px 12px", borderBottom: "1px solid #141414" }}>
            {CITIES.map(c => (
              <button key={c} onClick={() => setCityFilter(c)} style={{
                background: cityFilter === c ? "#161616" : "none",
                border: `1px solid ${cityFilter === c ? "#252525" : "#141414"}`,
                color: cityFilter === c ? "#888" : "#333",
                fontSize: 8, padding: "2px 6px", borderRadius: 2,
                cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.06em",
              }}>
                {c.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Shows list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredShows.map(show => (
              <button key={show.id} onClick={() => setSelectedShow(show)} style={{
                width: "100%", textAlign: "left",
                background: selectedShow?.id === show.id ? "#111" : "none",
                border: "none", borderBottom: "1px solid #0f0f0f",
                borderLeft: `2px solid ${selectedShow?.id === show.id ? "#3a7" : "transparent"}`,
                padding: "8px 12px", cursor: "pointer",
              }}>
                <div style={{ fontSize: 10, color: selectedShow?.id === show.id ? "#ccc" : "#666" }}>
                  {show.brand}
                </div>
                <div style={{ fontSize: 8, color: "#2a2a2a", marginTop: 2 }}>
                  {show.city?.toLowerCase()} · {show.total_looks ?? "?"} looks
                </div>
              </button>
            ))}
            {filteredShows.length === 0 && (
              <div style={{ padding: 16, color: "#2a2a2a", fontSize: 10 }}>no results</div>
            )}
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {!selectedShow ? (
            <div style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              color: "#222", fontSize: 11,
            }}>
              select a show to begin
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div style={{
                padding: "10px 18px", borderBottom: "1px solid #141414",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 12, flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div>
                    <span style={{ fontSize: 12, color: "#ddd" }}>{selectedShow.brand}</span>
                    <span style={{ fontSize: 9, color: "#333", marginLeft: 8 }}>
                      {selectedShow.city?.toLowerCase()}
                    </span>
                  </div>
                  {looks.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 72, height: 2, background: "#161616", borderRadius: 1 }}>
                        <div style={{
                          width: `${progress}%`, height: "100%", background: "#3a7",
                          borderRadius: 1, transition: "width 0.3s",
                        }} />
                      </div>
                      <span style={{ fontSize: 9, color: "#333" }}>
                        {taggedCount}/{looks.length}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={suggestAll} style={{
                    background: "none", border: "1px solid #1a1a1a", borderRadius: 2,
                    color: "#444", fontSize: 9, padding: "5px 10px", cursor: "pointer",
                    fontFamily: "inherit", letterSpacing: "0.06em",
                  }}>
                    ✦ suggest all untagged
                  </button>

                  {saveStatus === "saved" && (
                    <span style={{ fontSize: 9, color: "#3a7" }}>saved ✓</span>
                  )}
                  {saveStatus === "error" && (
                    <span style={{ fontSize: 9, color: "#a33" }}>error saving</span>
                  )}

                  <button
                    onClick={saveAll}
                    disabled={saving || dirtySet.size === 0}
                    style={{
                      background: dirtySet.size > 0 ? "#111a11" : "#0d0d0d",
                      border: `1px solid ${dirtySet.size > 0 ? "#1e3a1e" : "#161616"}`,
                      borderRadius: 2,
                      color: dirtySet.size > 0 ? "#3a7" : "#2a2a2a",
                      fontSize: 9, padding: "5px 12px",
                      cursor: dirtySet.size > 0 ? "pointer" : "default",
                      fontFamily: "inherit", letterSpacing: "0.06em",
                    }}
                  >
                    {saving ? "saving…" : `save all${dirtySet.size > 0 ? ` (${dirtySet.size})` : ""}`}
                  </button>
                </div>
              </div>

              {/* Look grid */}
              <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}>
                {loadingLooks ? (
                  <div style={{ color: "#2a2a2a", fontSize: 10, padding: "40px 0", textAlign: "center" }}>
                    loading…
                  </div>
                ) : (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                    gap: 10,
                  }}>
                    {looks.map(look => (
                      <LookCard
                        key={look.id}
                        look={look}
                        tags={tagMap[look.id] ?? []}
                        onTagsChange={tags => setLookTags(look.id, tags)}
                        onSuggest={() => handleSuggest(look)}
                        suggestState={suggestStateMap[look.id] ?? "idle"}
                        suggestedTags={getVisibleSuggestions(look.id)}
                        onAcceptSuggested={tag => handleAcceptSuggested(look.id, tag)}
                        onDismissSuggested={tag => handleDismissSuggested(look.id, tag)}
                        isDirty={dirtySet.has(look.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
