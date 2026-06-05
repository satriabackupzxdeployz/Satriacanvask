"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type Tab = "ff" | "ml";
type LobbyItem = { id: number; img: string };
type RankItem = { key: string; label: string; color: string };
type BorderItem = { id: number; img: string };
type GenResult = { image: string; username: string; lobby?: number; rank?: string; border?: number };

const SVG_FF = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SVG_ML = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
);
const SVG_DL = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3v12m0 0-4-4m4 4 4-4M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SVG_CHEVRON = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SVG_STAR = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const SVG_CHECK = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function SkeletonBox({ w, h, style }: { w?: string | number; h?: string | number; style?: React.CSSProperties }) {
  return <div className="skeleton" style={{ width: w ?? "100%", height: h ?? 20, ...style }} />;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("ff");
  const [ffLobbies, setFfLobbies] = useState<LobbyItem[]>([]);
  const [mlRanks, setMlRanks] = useState<RankItem[]>([]);
  const [mlBorders, setMlBorders] = useState<BorderItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [ffUsername, setFfUsername] = useState("");
  const [ffLobby, setFfLobby] = useState<number | null>(null);
  const [ffPage, setFfPage] = useState(1);

  const [mlUsername, setMlUsername] = useState("");
  const [mlRank, setMlRank] = useState("imo");
  const [mlBorder, setMlBorder] = useState(0);
  const [mlAvatarUrl, setMlAvatarUrl] = useState("");
  const [mlBorderPage, setMlBorderPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenResult | null>(null);
  const [err, setErr] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);
  const FF_PER_PAGE = 10;
  const BORDER_PER_PAGE = 8;

  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    const blockKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["s","u","c","a"].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["i","j"].includes(e.key.toLowerCase()))) e.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    document.addEventListener("keydown", blockKey);
    return () => { document.removeEventListener("contextmenu", block); document.removeEventListener("keydown", blockKey); };
  }, []);

  useEffect(() => {
    setDataLoading(true);
    Promise.all([
      fetch("/api/lobbies").then(r => r.json()),
      fetch("/api/ml-ranks").then(r => r.json()),
    ]).then(([ffData, mlData]) => {
      setFfLobbies(ffData.lobbies ?? []);
      setMlRanks(mlData.ranks ?? []);
      setMlBorders(mlData.borders ?? []);
    }).finally(() => setDataLoading(false));
  }, []);

  const handleTabChange = useCallback((t: Tab) => {
    setTab(t);
    setResult(null);
    setErr("");
  }, []);

  const handleFFGenerate = useCallback(async () => {
    if (!ffUsername.trim()) { setErr("Username wajib diisi!"); return; }
    setErr(""); setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: ffUsername.trim(), lobby: ffLobby }),
      });
      const data = await res.json();
      if (!res.ok) setErr(data.error || "Gagal generate");
      else { setResult(data); setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 80); }
    } catch { setErr("Koneksi error"); }
    finally { setLoading(false); }
  }, [ffUsername, ffLobby]);

  const handleMLGenerate = useCallback(async () => {
    if (!mlUsername.trim()) { setErr("Username wajib diisi!"); return; }
    setErr(""); setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/ml-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: mlUsername.trim(), rank: mlRank, border: mlBorder, avatar: mlAvatarUrl || undefined }),
      });
      const data = await res.json();
      if (!res.ok) setErr(data.error || "Gagal generate");
      else { setResult(data); setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 80); }
    } catch { setErr("Koneksi error"); }
    finally { setLoading(false); }
  }, [mlUsername, mlRank, mlBorder, mlAvatarUrl]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const ts = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const ext = tab === "ff" ? "jpg" : "png";
    const a = document.createElement("a");
    a.href = result.image;
    a.download = `satriacanvas-${ts}.${ext}`;
    a.click();
  }, [result, tab]);

  const ffTotalPages = Math.ceil(ffLobbies.length / FF_PER_PAGE);
  const visibleLobbies = ffLobbies.slice((ffPage - 1) * FF_PER_PAGE, ffPage * FF_PER_PAGE);
  const borderTotalPages = Math.ceil(mlBorders.length / BORDER_PER_PAGE);
  const visibleBorders = mlBorders.slice((mlBorderPage - 1) * BORDER_PER_PAGE, mlBorderPage * BORDER_PER_PAGE);
  const currentRank = mlRanks.find(r => r.key === mlRank);

  return (
    <main style={{ minHeight: "100dvh", paddingBottom: 80 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>

        <header className="fade-up" style={{ textAlign: "center", paddingTop: "10vh", paddingBottom: 48 }}>
          <div style={{
            display: "inline-block",
            background: "var(--paper)",
            border: "2px solid var(--ink)",
            borderRadius: "999px",
            padding: "4px 18px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            boxShadow: "2px 2px 0 0 var(--ink)",
            marginBottom: 20,
          }}>GAME CANVAS</div>
          <h1 style={{
            fontSize: "clamp(32px, 6vw, 52px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
            lineHeight: 1.1,
          }}>
            Satria<span style={{ color: "var(--ink-muted)" }}>Canvas</span>
          </h1>
          <p style={{
            marginTop: 10,
            color: "var(--ink-muted)",
            fontSize: 14,
            letterSpacing: "0.08em",
            fontWeight: 600,
            textTransform: "uppercase",
          }}>Lobby Card Generator</p>
        </header>

        <nav className="fade-up fade-up-d1" style={{
          display: "flex",
          gap: 0,
          marginBottom: 28,
          border: "2px solid var(--ink)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          background: "var(--paper)",
          boxShadow: "var(--shadow-brutal)",
        }}>
          {([["ff","Free Fire",SVG_FF,"var(--ff)"] , ["ml","Mobile Legends",SVG_ML,"var(--ml)"]] as const).map(([key, label, icon, color]) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              style={{
                flex: 1,
                padding: "14px 20px",
                background: tab === key ? "var(--ink)" : "transparent",
                color: tab === key ? "var(--paper)" : "var(--ink-muted)",
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "0.03em",
                borderRight: key === "ff" ? "2px solid var(--ink)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.15s ease",
                cursor: "pointer",
              }}
            >
              <span style={{ color: tab === key ? (key === "ff" ? "#ffd166" : "#90c2ff") : color }}>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {tab === "ff" && (
          <div className="slide-in">
            <FFForm
              username={ffUsername} setUsername={setFfUsername}
              selectedLobby={ffLobby} setSelectedLobby={setFfLobby}
              loading={loading} onGenerate={handleFFGenerate}
              err={err}
            />
            <FFLobbyTable
              lobbies={visibleLobbies}
              dataLoading={dataLoading}
              selectedLobby={ffLobby}
              onSelect={(id) => setFfLobby(id === ffLobby ? null : id)}
              page={ffPage} totalPages={ffTotalPages}
              onPageChange={setFfPage}
            />
          </div>
        )}

        {tab === "ml" && (
          <div className="slide-in">
            <MLForm
              username={mlUsername} setUsername={setMlUsername}
              rank={mlRank} setRank={setMlRank}
              border={mlBorder} setBorder={setMlBorder}
              avatarUrl={mlAvatarUrl} setAvatarUrl={setMlAvatarUrl}
              ranks={mlRanks}
              loading={loading} onGenerate={handleMLGenerate}
              err={err}
            />
            <MLBorderTable
              borders={visibleBorders}
              dataLoading={dataLoading}
              ranks={mlRanks}
              selectedBorder={mlBorder}
              onSelect={(id) => setMlBorder(id === mlBorder ? 0 : id)}
              page={mlBorderPage} totalPages={borderTotalPages}
              onPageChange={setMlBorderPage}
              currentRank={currentRank}
            />
          </div>
        )}

        {result && (
          <OutputSection
            ref={outputRef}
            result={result}
            tab={tab}
            onDownload={handleDownload}
          />
        )}

        <footer style={{ textAlign: "center", paddingTop: 24, paddingBottom: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>SatriaCanvas</span>
          <a href="/docs" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 16px",
            background: "var(--paper)",
            border: "2px solid var(--ink)",
            borderRadius: "999px",
            color: "var(--ink)",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
            boxShadow: "2px 2px 0 0 var(--ink)",
            transition: "all 0.13s",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            API Docs
          </a>
        </footer>
      </div>
    </main>
  );
}

function Card({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div className="brutal-card fade-up" style={{ marginBottom: 24, animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function CardHeader({ label, right }: { label: string; right?: React.ReactNode }) {
  return (
    <div style={{
      padding: "14px 20px",
      borderBottom: "2px solid var(--ink)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "var(--ink)",
      borderRadius: "calc(var(--radius-lg) - 2px) calc(var(--radius-lg) - 2px) 0 0",
    }}>
      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", color: "var(--paper)", textTransform: "uppercase" }}>{label}</span>
      {right && <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,253,247,0.55)", letterSpacing: "0.05em" }}>{right}</span>}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, maxLength, onKeyDown, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; maxLength?: number; onKeyDown?: (e: React.KeyboardEvent) => void; hint?: string;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--ink-soft)", textTransform: "uppercase" }}>{label}</label>
        {hint && <span style={{ fontSize: 11, fontWeight: 600, color: value.length >= (maxLength ?? 99) - 2 ? "var(--ink)" : "var(--ink-muted)" }}>{value.length}/{maxLength}</span>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="brutal-input"
        style={{
          width: "100%",
          padding: "11px 14px",
          fontSize: 16,
          fontWeight: 700,
          boxShadow: focus ? "3px 3px 0 0 var(--ink)" : "none",
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string; color?: string }[];
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="brutal-input"
          style={{
            width: "100%",
            appearance: "none",
            WebkitAppearance: "none",
            padding: "11px 36px 11px 14px",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: focus ? "3px 3px 0 0 var(--ink)" : "none",
          }}
        >
          {options.map(o => (
            <option key={o.value} value={o.value} style={{ background: "#fff", color: "#1a1a1a" }}>{o.label}</option>
          ))}
        </select>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink)", pointerEvents: "none" }}>
          {SVG_CHEVRON}
        </div>
      </div>
    </div>
  );
}

function ChipBtn({ active, onClick, children, activeStyle }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
  activeStyle?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        background: active ? "var(--ink)" : "var(--paper)",
        border: "2px solid var(--ink)",
        borderRadius: "999px",
        color: active ? "var(--paper)" : "var(--ink-muted)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        cursor: "pointer",
        transition: "all 0.13s ease",
        boxShadow: active ? "2px 2px 0 0 rgba(26,26,26,0.3)" : "1px 1px 0 0 var(--ink)",
        ...activeStyle,
      }}
    >{children}</button>
  );
}

function NumBtn({ active, onClick, children, activeColor }: {
  active: boolean; onClick: () => void; children: React.ReactNode; activeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 34,
        height: 30,
        background: active ? (activeColor ?? "var(--ink)") : "var(--paper)",
        border: "2px solid var(--ink)",
        borderRadius: "var(--radius-sm)",
        color: active ? "var(--paper)" : "var(--ink-muted)",
        fontSize: 11,
        fontWeight: 800,
        cursor: "pointer",
        transition: "all 0.13s ease",
        boxShadow: active ? "2px 2px 0 0 rgba(26,26,26,0.35)" : "1px 1px 0 0 var(--ink)",
      }}
    >{children}</button>
  );
}

function FFForm({ username, setUsername, selectedLobby, setSelectedLobby, loading, onGenerate, err }: {
  username: string; setUsername: (v: string) => void;
  selectedLobby: number | null; setSelectedLobby: (v: number | null) => void;
  loading: boolean; onGenerate: () => void; err: string;
}) {
  return (
    <Card>
      <CardHeader label="Free Fire — Input" right="Lobby 1–30 · maks 20 karakter" />
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
        <InputField
          label="Username" value={username} onChange={setUsername}
          placeholder="Masukkan username..." maxLength={20} hint="true"
          onKeyDown={(e) => e.key === "Enter" && onGenerate()}
        />
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 10 }}>Pilih Nomor Lobby</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <ChipBtn active={selectedLobby === null} onClick={() => setSelectedLobby(null)}>RANDOM</ChipBtn>
            {Array.from({ length: 30 }, (_, i) => i + 1).map(n => (
              <NumBtn key={n} active={selectedLobby === n} onClick={() => setSelectedLobby(n === selectedLobby ? null : n)} activeColor="var(--ink)">{n}</NumBtn>
            ))}
          </div>
        </div>
        {err && (
          <div style={{
            padding: "10px 14px",
            background: "rgba(255,122,107,0.12)",
            border: "2px solid #ff7a6b",
            borderRadius: "var(--radius-sm)",
            color: "#c0392b",
            fontSize: 13,
            fontWeight: 700,
          }}>⚠ {err}</div>
        )}
        <button
          onClick={onGenerate}
          disabled={loading}
          className={loading ? "" : "brutal-btn"}
          style={{
            padding: "13px 0",
            width: "100%",
            background: loading ? "rgba(26,26,26,0.08)" : "var(--ink)",
            border: "2px solid var(--ink)",
            borderRadius: "var(--radius-md)",
            color: loading ? "var(--ink-muted)" : "var(--paper)",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "var(--shadow-brutal-sm)",
            transition: "all 0.15s ease",
          }}
        >{loading ? "MEMPROSES..." : "▶  GENERATE FF"}</button>
      </div>
    </Card>
  );
}

function MLForm({ username, setUsername, rank, setRank, border, setBorder, avatarUrl, setAvatarUrl, ranks, loading, onGenerate, err }: {
  username: string; setUsername: (v: string) => void;
  rank: string; setRank: (v: string) => void;
  border: number; setBorder: (v: number) => void;
  avatarUrl: string; setAvatarUrl: (v: string) => void;
  ranks: RankItem[];
  loading: boolean; onGenerate: () => void; err: string;
}) {
  const currentRank = ranks.find(r => r.key === rank);
  return (
    <Card>
      <CardHeader label="Mobile Legends — Input" right="7 rank · 16 border" />
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <InputField label="Username" value={username} onChange={setUsername}
            placeholder="Nama player..." maxLength={15} hint="true"
            onKeyDown={(e) => e.key === "Enter" && onGenerate()}
          />
          <SelectField
            label="Rank" value={rank} onChange={setRank}
            options={ranks.map(r => ({ value: r.key, label: r.label }))}
          />
        </div>
        {currentRank && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            background: "var(--cream)",
            border: "2px solid var(--ink)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "2px 2px 0 0 var(--ink)",
          }}>
            <img src={`/ml/rank/${currentRank.key}.webp`} alt={currentRank.label} style={{ width: 36, height: 36, objectFit: "contain" }} draggable={false} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: currentRank.color }}>{currentRank.label}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Rank Dipilih</div>
            </div>
            <span style={{ marginLeft: "auto", color: currentRank.color }}>{SVG_STAR}</span>
          </div>
        )}
        <InputField label="Avatar URL (opsional)" value={avatarUrl} onChange={setAvatarUrl}
          placeholder="https://example.com/avatar.jpg"
        />
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--ink-soft)", textTransform: "uppercase" }}>Border</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-muted)" }}>{border === 0 ? "default gold" : `border #${border}`}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <ChipBtn active={border === 0} onClick={() => setBorder(0)}>DEFAULT</ChipBtn>
            {Array.from({ length: 16 }, (_, i) => i + 1).map(n => (
              <NumBtn key={n} active={border === n} onClick={() => setBorder(n === border ? 0 : n)}>{n}</NumBtn>
            ))}
          </div>
        </div>
        {err && (
          <div style={{
            padding: "10px 14px",
            background: "rgba(255,122,107,0.12)",
            border: "2px solid #ff7a6b",
            borderRadius: "var(--radius-sm)",
            color: "#c0392b",
            fontSize: 13,
            fontWeight: 700,
          }}>⚠ {err}</div>
        )}
        <button
          onClick={onGenerate}
          disabled={loading}
          className={loading ? "" : "brutal-btn"}
          style={{
            padding: "13px 0",
            width: "100%",
            background: loading ? "rgba(26,26,26,0.08)" : "var(--ink)",
            border: "2px solid var(--ink)",
            borderRadius: "var(--radius-md)",
            color: loading ? "var(--ink-muted)" : "var(--paper)",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "var(--shadow-brutal-sm)",
            transition: "all 0.15s ease",
          }}
        >{loading ? "MEMPROSES..." : "▶  GENERATE ML"}</button>
      </div>
    </Card>
  );
}

function Paginator({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  return (
    <div style={{ padding: "12px 20px", borderTop: "2px solid var(--ink)", display: "flex", justifyContent: "center", gap: 6, alignItems: "center", background: "rgba(26,26,26,0.03)" }}>
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}
        style={{ padding: "5px 12px", background: "var(--paper)", border: "2px solid var(--ink)", borderRadius: "var(--radius-sm)", color: page === 1 ? "var(--ink-muted)" : "var(--ink)", fontSize: 11, fontWeight: 700, cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, boxShadow: page === 1 ? "none" : "1px 1px 0 0 var(--ink)" }}>‹ PREV</button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)}
          style={{ width: 30, height: 28, background: p === page ? "var(--ink)" : "var(--paper)", border: "2px solid var(--ink)", borderRadius: "var(--radius-sm)", color: p === page ? "var(--paper)" : "var(--ink-muted)", fontSize: 11, fontWeight: 800, cursor: "pointer", boxShadow: p === page ? "none" : "1px 1px 0 0 var(--ink)" }}>{p}</button>
      ))}
      <button onClick={() => onChange(Math.min(total, page + 1))} disabled={page === total}
        style={{ padding: "5px 12px", background: "var(--paper)", border: "2px solid var(--ink)", borderRadius: "var(--radius-sm)", color: page === total ? "var(--ink-muted)" : "var(--ink)", fontSize: 11, fontWeight: 700, cursor: page === total ? "not-allowed" : "pointer", opacity: page === total ? 0.4 : 1, boxShadow: page === total ? "none" : "1px 1px 0 0 var(--ink)" }}>NEXT ›</button>
    </div>
  );
}

const TH_STYLE: React.CSSProperties = {
  padding: "10px 16px",
  textAlign: "left",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.2em",
  color: "var(--ink-muted)",
  borderBottom: "2px solid var(--ink)",
  background: "var(--cream)",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

function FFLobbyTable({ lobbies, dataLoading, selectedLobby, onSelect, page, totalPages, onPageChange }: {
  lobbies: LobbyItem[]; dataLoading: boolean;
  selectedLobby: number | null; onSelect: (id: number) => void;
  page: number; totalPages: number; onPageChange: (p: number) => void;
}) {
  return (
    <Card delay={0.05}>
      <CardHeader label="Daftar Lobby FF" right={`${dataLoading ? "—" : "30"} lobby tersedia`} />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
          <thead>
            <tr>
              {["No","Preview","Nama Lobby","Status"].map(h => <th key={h} style={TH_STYLE}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {dataLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(26,26,26,0.1)" }}>
                  <td style={{ padding: "10px 16px" }}><SkeletonBox w={24} h={14} /></td>
                  <td style={{ padding: "10px 16px" }}><SkeletonBox w={80} h={46} /></td>
                  <td style={{ padding: "10px 16px" }}><SkeletonBox w={80} h={14} /></td>
                  <td style={{ padding: "10px 16px" }}><SkeletonBox w={50} h={20} /></td>
                </tr>
              ))
            ) : lobbies.map((lb, idx) => {
              const sel = selectedLobby === lb.id;
              return (
                <tr key={lb.id} onClick={() => onSelect(lb.id)}
                  style={{
                    background: sel ? "rgba(255,224,102,0.35)" : idx % 2 === 0 ? "var(--paper)" : "var(--cream)",
                    cursor: "pointer",
                    borderBottom: "1px solid rgba(26,26,26,0.1)",
                    transition: "background 0.12s",
                    outline: sel ? "2px solid var(--ink)" : "none",
                    outlineOffset: sel ? "-2px" : "0",
                  }}
                  onMouseEnter={(e) => { if (!sel) (e.currentTarget as HTMLTableRowElement).style.background = "rgba(26,26,26,0.04)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = sel ? "rgba(255,224,102,0.35)" : idx % 2 === 0 ? "var(--paper)" : "var(--cream)"; }}
                >
                  <td style={{ padding: "8px 16px", fontSize: 13, fontWeight: 800, color: sel ? "var(--ink)" : "var(--ink-muted)", fontVariantNumeric: "tabular-nums" }}>{String(lb.id).padStart(2, "0")}</td>
                  <td style={{ padding: "7px 16px" }}>
                    <div style={{
                      width: 110,
                      height: 62,
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      border: `2px solid ${sel ? "var(--ink)" : "rgba(26,26,26,0.2)"}`,
                      transition: "border-color 0.15s",
                      flexShrink: 0,
                      boxShadow: sel ? "2px 2px 0 0 var(--ink)" : "none",
                    }}>
                      <img src={lb.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} draggable={false} />
                    </div>
                  </td>
                  <td style={{ padding: "8px 16px", fontSize: 14, fontWeight: 700, color: sel ? "var(--ink)" : "var(--ink-soft)" }}>Lobby {lb.id}</td>
                  <td style={{ padding: "8px 16px" }}>
                    {sel ? (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "4px 10px",
                        background: "var(--ink)",
                        border: "2px solid var(--ink)",
                        borderRadius: "999px",
                        color: "var(--paper)",
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.12em",
                      }}>{SVG_CHECK} DIPILIH</span>
                    ) : (
                      <span style={{ fontSize: 12, color: "rgba(26,26,26,0.2)", fontWeight: 600 }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Paginator page={page} total={totalPages} onChange={onPageChange} />
    </Card>
  );
}

function MLBorderTable({ borders, dataLoading, ranks, selectedBorder, onSelect, page, totalPages, onPageChange, currentRank }: {
  borders: BorderItem[]; dataLoading: boolean;
  ranks: RankItem[];
  selectedBorder: number; onSelect: (id: number) => void;
  page: number; totalPages: number; onPageChange: (p: number) => void;
  currentRank?: RankItem;
}) {
  return (
    <>
      <Card delay={0.05}>
        <CardHeader label="Rank Tersedia" right={`${ranks.length} rank`} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
            <thead>
              <tr>
                {["Key","Icon","Nama Rank","Warna"].map(h => <th key={h} style={TH_STYLE}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {dataLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(26,26,26,0.1)" }}>
                    {[24,40,80,60].map((w,j) => <td key={j} style={{ padding: "10px 16px" }}><SkeletonBox w={w} h={14} /></td>)}
                  </tr>
                ))
              ) : ranks.map((r, idx) => {
                const active = currentRank?.key === r.key;
                return (
                  <tr key={r.key} style={{
                    background: active ? "rgba(255,224,102,0.3)" : idx % 2 === 0 ? "var(--paper)" : "var(--cream)",
                    borderBottom: "1px solid rgba(26,26,26,0.1)",
                    outline: active ? "2px solid var(--ink)" : "none",
                    outlineOffset: active ? "-2px" : "0",
                  }}>
                    <td style={{ padding: "10px 16px", fontSize: 12, fontWeight: 800, color: active ? "var(--ink)" : "var(--ink-muted)", letterSpacing: "0.08em", fontFamily: "monospace" }}>{r.key}</td>
                    <td style={{ padding: "8px 16px" }}>
                      <img src={`/ml/rank/${r.key}.webp`} alt={r.label} style={{ width: 36, height: 36, objectFit: "contain", display: "block" }} draggable={false} />
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 14, fontWeight: 700, color: active ? "var(--ink)" : "var(--ink-soft)" }}>{r.label}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", background: r.color, border: "2px solid var(--ink)", flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", fontFamily: "monospace" }}>{r.color}</span>
                        {active && (
                          <span style={{ marginLeft: 4, display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", background: "var(--ink)", border: "2px solid var(--ink)", borderRadius: "999px", fontSize: 9, color: "var(--paper)", fontWeight: 800, letterSpacing: "0.1em" }}>
                            {SVG_CHECK} AKTIF
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card delay={0.08}>
        <CardHeader label="Daftar Border" right={`${dataLoading ? "—" : "16"} border`} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 380 }}>
            <thead>
              <tr>
                {["No","Preview","Nama","Status"].map(h => <th key={h} style={TH_STYLE}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {dataLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(26,26,26,0.1)" }}>
                    {[24,60,80,50].map((w,j) => <td key={j} style={{ padding: "10px 16px" }}><SkeletonBox w={w} h={14} /></td>)}
                  </tr>
                ))
              ) : borders.map((b, idx) => {
                const sel = selectedBorder === b.id;
                return (
                  <tr key={b.id} onClick={() => onSelect(b.id)}
                    style={{
                      background: sel ? "rgba(168,208,240,0.35)" : idx % 2 === 0 ? "var(--paper)" : "var(--cream)",
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(26,26,26,0.1)",
                      transition: "background 0.12s",
                      outline: sel ? "2px solid var(--ink)" : "none",
                      outlineOffset: sel ? "-2px" : "0",
                    }}
                    onMouseEnter={(e) => { if (!sel) (e.currentTarget as HTMLTableRowElement).style.background = "rgba(26,26,26,0.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = sel ? "rgba(168,208,240,0.35)" : idx % 2 === 0 ? "var(--paper)" : "var(--cream)"; }}
                  >
                    <td style={{ padding: "8px 16px", fontSize: 13, fontWeight: 800, color: sel ? "var(--ink)" : "var(--ink-muted)", fontVariantNumeric: "tabular-nums" }}>{String(b.id).padStart(2,"0")}</td>
                    <td style={{ padding: "7px 16px" }}>
                      <div style={{ width: 56, height: 56, borderRadius: "var(--radius-sm)", overflow: "hidden", border: `2px solid ${sel ? "var(--ink)" : "rgba(26,26,26,0.2)"}`, background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: sel ? "2px 2px 0 0 var(--ink)" : "none" }}>
                        <img src={b.img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} draggable={false} />
                      </div>
                    </td>
                    <td style={{ padding: "8px 16px", fontSize: 14, fontWeight: 700, color: sel ? "var(--ink)" : "var(--ink-soft)" }}>Border {b.id}</td>
                    <td style={{ padding: "8px 16px" }}>
                      {sel ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "var(--ink)", border: "2px solid var(--ink)", borderRadius: "999px", color: "var(--paper)", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em" }}>
                          {SVG_CHECK} DIPILIH
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: "rgba(26,26,26,0.2)", fontWeight: 600 }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Paginator page={page} total={totalPages} onChange={onPageChange} />
      </Card>
    </>
  );
}

const OutputSection = ({ result, tab, onDownload, ref }: {
  result: GenResult; tab: Tab; onDownload: () => void; ref: React.RefObject<HTMLDivElement | null>;
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const accentBg = tab === "ff" ? "rgba(255,224,102,0.35)" : "rgba(168,208,240,0.35)";
  return (
    <div ref={ref} className="brutal-card pop" style={{ marginBottom: 24, overflow: "hidden" }}>
      <CardHeader
        label="Output"
        right={`${result.username} · ${tab === "ff" ? `lobby ${result.lobby}` : `${result.rank} · border ${result.border ?? 0}`}`}
      />
      <div style={{ padding: 20, background: accentBg }}>
        <div style={{
          position: "relative",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          border: "2px solid var(--ink)",
          background: "var(--paper)",
          boxShadow: "var(--shadow-brutal)",
          lineHeight: 0,
        }}>
          {!imgLoaded && (
            <div className="skeleton" style={{ width: "100%", aspectRatio: "9/16", minHeight: 280 }} />
          )}
          <img
            src={result.image}
            alt="output"
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%",
              display: "block",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.3s",
              objectFit: "contain",
            }}
            draggable={false}
          />
        </div>
        <button
          onClick={onDownload}
          className="brutal-btn"
          style={{
            marginTop: 16,
            width: "100%",
            padding: "13px 0",
            background: "var(--ink)",
            border: "2px solid var(--ink)",
            borderRadius: "var(--radius-md)",
            color: "var(--paper)",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "var(--shadow-brutal-sm)",
          }}
        >{SVG_DL} DOWNLOAD</button>
      </div>
    </div>
  );
};
