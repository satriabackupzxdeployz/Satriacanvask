"use client";
import { useState } from "react";

const DOMAIN = "https://satriacanvas.vercel.app";

const FF_LOBBIES = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  img: `/lobbies/${i + 1}.jpg`,
}));

const ML_RANKS = [
  { key: "imo",    label: "Immortal",    color: "#e8d5a3" },
  { key: "mawi",   label: "Mythic",      color: "#c084fc" },
  { key: "legend", label: "Legend",      color: "#f97316" },
  { key: "epic",   label: "Epic",        color: "#a855f7" },
  { key: "gm",     label: "Grandmaster", color: "#60a5fa" },
  { key: "glory",  label: "Glory",       color: "#34d399" },
  { key: "honor",  label: "Honor",       color: "#94a3b8" },
];

const ML_BORDERS = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  img: `/ml/border/${i + 1}.webp`,
}));

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={handle}
      style={{
        padding: "4px 12px",
        background: copied ? "var(--ink)" : "var(--paper)",
        border: "2px solid var(--ink)",
        borderRadius: "999px",
        color: copied ? "var(--paper)" : "var(--ink)",
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.1em",
        cursor: "pointer",
        transition: "all 0.13s",
        boxShadow: copied ? "none" : "1px 1px 0 0 var(--ink)",
        whiteSpace: "nowrap",
      }}
    >{copied ? "COPIED!" : "COPY"}</button>
  );
}

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  return (
    <div style={{
      background: "#0d1117",
      border: "2px solid var(--ink)",
      borderRadius: "var(--radius-md)",
      boxShadow: "4px 4px 0 0 var(--ink)",
      overflow: "hidden",
      marginTop: 10,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 14px",
        borderBottom: "1px solid #30363d",
        background: "#161b22",
      }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56", border: "1.5px solid rgba(0,0,0,0.3)" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e", border: "1.5px solid rgba(0,0,0,0.3)" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f", border: "1.5px solid rgba(0,0,0,0.3)" }} />
          <span style={{ marginLeft: 8, fontSize: 11, color: "#8b949e", fontFamily: "monospace", fontWeight: 600 }}>{lang}</span>
        </div>
        <CopyBtn text={code.trim()} />
      </div>
      <pre style={{
        margin: 0,
        padding: "16px 18px",
        overflowX: "auto",
        fontSize: 13,
        lineHeight: 1.7,
        color: "#e6edf3",
        fontFamily: "ui-monospace, 'JetBrains Mono', monospace",
        whiteSpace: "pre",
      }}><code>{code.trim()}</code></pre>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      background: color,
      border: "2px solid var(--ink)",
      borderRadius: "999px",
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: "0.12em",
      color: "var(--ink)",
      boxShadow: "1px 1px 0 0 var(--ink)",
    }}>{children}</span>
  );
}

function ParamRow({ name, type, required, def, desc }: {
  name: string; type: string; required: boolean; def?: string; desc: string;
}) {
  return (
    <tr style={{ borderBottom: "1px solid rgba(26,26,26,0.1)" }}>
      <td style={{ padding: "10px 14px" }}>
        <code style={{ fontSize: 12, fontWeight: 800, fontFamily: "monospace", color: "var(--ink)" }}>{name}</code>
        {required && (
          <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 800, color: "#c0392b", letterSpacing: "0.1em" }}>WAJIB</span>
        )}
      </td>
      <td style={{ padding: "10px 14px" }}>
        <code style={{ fontSize: 11, background: "rgba(26,26,26,0.07)", padding: "2px 7px", borderRadius: 4, fontFamily: "monospace", color: "var(--ink-soft)" }}>{type}</code>
      </td>
      <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--ink-muted)", fontWeight: 600 }}>{def ?? "—"}</td>
      <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--ink-soft)", fontWeight: 600 }}>{desc}</td>
    </tr>
  );
}

const TH: React.CSSProperties = {
  padding: "10px 14px",
  textAlign: "left",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.18em",
  color: "var(--ink-muted)",
  borderBottom: "2px solid var(--ink)",
  background: "var(--cream)",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

function SectionTitle({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, marginTop: 40 }}>
      <div style={{
        width: 32,
        height: 32,
        background: "var(--ink)",
        border: "2px solid var(--ink)",
        borderRadius: "var(--radius-sm)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--paper)",
        fontSize: 12,
        fontWeight: 900,
        boxShadow: "2px 2px 0 0 rgba(26,26,26,0.3)",
        flexShrink: 0,
      }}>{num}</div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: "var(--ink)", letterSpacing: "-0.02em" }}>{children}</h2>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--paper)",
      border: "2px solid var(--ink)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "4px 4px 0 0 var(--ink)",
      overflow: "hidden",
      marginBottom: 20,
    }}>{children}</div>
  );
}

function CardHeader({ label, badge, badgeColor = "#a8e8c9" }: {
  label: string; badge?: string; badgeColor?: string;
}) {
  return (
    <div style={{
      padding: "14px 20px",
      borderBottom: "2px solid var(--ink)",
      background: "var(--ink)",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}>
      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", color: "var(--paper)", textTransform: "uppercase" }}>{label}</span>
      {badge && <Badge color={badgeColor}>{badge}</Badge>}
    </div>
  );
}

export default function DocsPage() {
  const [ffLobbyPage, setFfLobbyPage] = useState(1);
  const FF_PER_PAGE = 10;
  const ffTotalPages = Math.ceil(FF_LOBBIES.length / FF_PER_PAGE);
  const visibleLobbies = FF_LOBBIES.slice((ffLobbyPage - 1) * FF_PER_PAGE, ffLobbyPage * FF_PER_PAGE);

  return (
    <main style={{ minHeight: "100dvh", paddingBottom: 80 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>

        <header style={{ textAlign: "center", paddingTop: "8vh", paddingBottom: 48 }}>
          <div style={{
            display: "inline-block",
            background: "var(--paper)",
            border: "2px solid var(--ink)",
            borderRadius: "999px",
            padding: "4px 18px",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            boxShadow: "2px 2px 0 0 var(--ink)",
            marginBottom: 20,
          }}>API DOCUMENTATION</div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
            lineHeight: 1.1,
          }}>
            SatriaCanvas<span style={{ color: "var(--ink-muted)" }}> API</span>
          </h1>
          <p style={{ marginTop: 12, color: "var(--ink-muted)", fontSize: 14, fontWeight: 600 }}>
            Endpoint publik api fake-ff && fake-ml
          </p>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            <Badge color="#a8f0c9">GET only</Badge>
            <Badge color="#ffe066">Image Response</Badge>
            <Badge color="#ffc5bd">No Auth Required</Badge>
          </div>
        </header>

        <nav style={{
          background: "var(--paper)",
          border: "2px solid var(--ink)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "4px 4px 0 0 var(--ink)",
          padding: "16px 20px",
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: "var(--ink-muted)", textTransform: "uppercase", marginBottom: 10 }}>Daftar Isi</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              ["#overview","Overview"],
              ["#ff-endpoint","Endpoint FF"],
              ["#ml-endpoint","Endpoint ML"],
              ["#error","Error Response"],
              ["#examples","Contoh Penggunaan"],
            ].map(([href, label]) => (
              <a key={href} href={href} style={{
                padding: "5px 13px",
                background: "var(--cream)",
                border: "2px solid var(--ink)",
                borderRadius: "999px",
                color: "var(--ink)",
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "1px 1px 0 0 var(--ink)",
                transition: "all 0.12s",
              }}>{label}</a>
            ))}
          </div>
        </nav>

        <div id="overview">
          <SectionTitle num="01">Overview</SectionTitle>
          <Card>
            <CardHeader label="Base URL" />
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-muted)", marginBottom: 10 }}>
                Ganti <code style={{ background: "rgba(26,26,26,0.08)", padding: "1px 6px", borderRadius: 4, fontFamily: "monospace", fontWeight: 800 }}>{DOMAIN}</code> dengan domain Vercel kamu.
              </div>
              <CodeBlock lang="text" code={`https://${DOMAIN}`} />
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { method: "GET", path: `/fake-ff`, desc: "Generate kartu lobby Free Fire, response langsung gambar JPG" },
                  { method: "GET", path: `/fake-ml`, desc: "Generate kartu lobby Mobile Legends, response langsung gambar PNG" },
                ].map(e => (
                  <div key={e.path} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "12px 14px",
                    background: "var(--cream)",
                    border: "2px solid var(--ink)",
                    borderRadius: "var(--radius-sm)",
                    boxShadow: "2px 2px 0 0 var(--ink)",
                  }}>
                    <Badge color="#a8e8c9">{e.method}</Badge>
                    <code style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: "var(--ink)" }}>{e.path}</code>
                    <span style={{ fontSize: 13, color: "var(--ink-muted)", fontWeight: 600, marginLeft: "auto" }}>{e.desc}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(255,224,102,0.3)", border: "2px solid var(--ink)", borderRadius: "var(--radius-sm)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
                  Response dari kedua endpoint adalah <strong>binary image</strong> langsung — bukan JSON. Cocok untuk ditampilkan langsung di browser, WhatsApp Bot, Telegram Bot, dan lainnya.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div id="ff-endpoint">
          <SectionTitle num="02">Endpoint Free Fire</SectionTitle>

          <Card>
            <CardHeader label="GET /fake-ff" badge="JPEG" badgeColor="#ffe066" />
            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 6 }}>Endpoint</div>
                <CodeBlock lang="text" code={`GET https://${DOMAIN}/fake-ff?usr={username}&lobby={1-30}`} />
              </div>

              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 8, marginTop: 20 }}>Parameter Query</div>
              <div style={{ border: "2px solid var(--ink)", borderRadius: "var(--radius-sm)", overflow: "hidden", boxShadow: "2px 2px 0 0 var(--ink)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Parameter","Tipe","Default","Deskripsi"].map(h => <th key={h} style={TH}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <ParamRow name="usr" type="string" required def="—" desc="Username yang akan ditampilkan di kartu lobby. Maksimal 20 karakter." />
                    <ParamRow name="lobby" type="number" required={false} def="random" desc="Nomor background lobby (1–30). Jika tidak diisi akan dipilih secara acak." />
                  </tbody>
                </table>
              </div>

              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 8, marginTop: 20 }}>Response Header</div>
              <div style={{ border: "2px solid var(--ink)", borderRadius: "var(--radius-sm)", overflow: "hidden", boxShadow: "2px 2px 0 0 var(--ink)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Header","Nilai"].map(h => <th key={h} style={TH}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Content-Type","image/jpeg"],
                      ["Content-Disposition","inline; filename=\"ff-{username}-lobby{n}.jpg\""],
                      ["X-Username","username yang digunakan"],
                      ["X-Lobby","nomor lobby yang digunakan"],
                      ["Cache-Control","no-store"],
                    ].map(([h, v], i) => (
                      <tr key={h} style={{ borderBottom: "1px solid rgba(26,26,26,0.1)", background: i % 2 === 0 ? "var(--paper)" : "var(--cream)" }}>
                        <td style={{ padding: "9px 14px" }}><code style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: "var(--ink)" }}>{h}</code></td>
                        <td style={{ padding: "9px 14px", fontSize: 12, color: "var(--ink-muted)", fontFamily: "monospace", fontWeight: 600 }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 8, marginTop: 20 }}>Contoh Request</div>
              <CodeBlock lang="bash" code={`curl -o output.jpg "https://${DOMAIN}/fake-ff?usr=SatriaGaming&lobby=5"`} />
              <CodeBlock lang="bash" code={`curl -o output.jpg "https://${DOMAIN}/fake-ff?usr=PlayerSatu"`} />
            </div>
          </Card>

          <Card>
            <CardHeader label="Daftar Nomor Lobby FF" badge={`${FF_LOBBIES.length} lobby`} badgeColor="#ffd166" />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
                <thead>
                  <tr>{["No","Preview","Nilai Parameter"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {visibleLobbies.map((lb, idx) => (
                    <tr key={lb.id} style={{ borderBottom: "1px solid rgba(26,26,26,0.1)", background: idx % 2 === 0 ? "var(--paper)" : "var(--cream)" }}>
                      <td style={{ padding: "8px 14px", fontSize: 13, fontWeight: 800, color: "var(--ink-muted)", fontVariantNumeric: "tabular-nums" }}>{String(lb.id).padStart(2,"0")}</td>
                      <td style={{ padding: "6px 14px" }}>
                        <div style={{ width: 110, height: 62, borderRadius: "var(--radius-sm)", overflow: "hidden", border: "2px solid rgba(26,26,26,0.2)", boxShadow: "1px 1px 0 0 var(--ink)" }}>
                          <img src={lb.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} draggable={false} />
                        </div>
                      </td>
                      <td style={{ padding: "8px 14px" }}>
                        <code style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, background: "rgba(26,26,26,0.07)", padding: "3px 8px", borderRadius: 4 }}>lobby={lb.id}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {ffTotalPages > 1 && (
              <div style={{ padding: "12px 20px", borderTop: "2px solid var(--ink)", display: "flex", justifyContent: "center", gap: 6, background: "rgba(26,26,26,0.02)" }}>
                <button onClick={() => setFfLobbyPage(p => Math.max(1, p - 1))} disabled={ffLobbyPage === 1}
                  style={{ padding: "5px 12px", background: "var(--paper)", border: "2px solid var(--ink)", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 700, cursor: ffLobbyPage === 1 ? "not-allowed" : "pointer", opacity: ffLobbyPage === 1 ? 0.4 : 1, boxShadow: "1px 1px 0 0 var(--ink)", color: "var(--ink)" }}>‹ PREV</button>
                {Array.from({ length: ffTotalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setFfLobbyPage(p)}
                    style={{ width: 30, height: 28, background: p === ffLobbyPage ? "var(--ink)" : "var(--paper)", border: "2px solid var(--ink)", borderRadius: "var(--radius-sm)", color: p === ffLobbyPage ? "var(--paper)" : "var(--ink-muted)", fontSize: 11, fontWeight: 800, cursor: "pointer", boxShadow: p === ffLobbyPage ? "none" : "1px 1px 0 0 var(--ink)" }}>{p}</button>
                ))}
                <button onClick={() => setFfLobbyPage(p => Math.min(ffTotalPages, p + 1))} disabled={ffLobbyPage === ffTotalPages}
                  style={{ padding: "5px 12px", background: "var(--paper)", border: "2px solid var(--ink)", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 700, cursor: ffLobbyPage === ffTotalPages ? "not-allowed" : "pointer", opacity: ffLobbyPage === ffTotalPages ? 0.4 : 1, boxShadow: "1px 1px 0 0 var(--ink)", color: "var(--ink)" }}>NEXT ›</button>
              </div>
            )}
          </Card>
        </div>

        <div id="ml-endpoint">
          <SectionTitle num="03">Endpoint Mobile Legends</SectionTitle>

          <Card>
            <CardHeader label="GET /fake-ml" badge="PNG" badgeColor="#c9a9f0" />
            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 6 }}>Endpoint</div>
                <CodeBlock lang="text" code={`GET https://${DOMAIN}/fake-ml?usr={username}&rank={rank_key}&border={1-16}&avatar={url}`} />
              </div>

              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 8, marginTop: 20 }}>Parameter Query</div>
              <div style={{ border: "2px solid var(--ink)", borderRadius: "var(--radius-sm)", overflow: "hidden", boxShadow: "2px 2px 0 0 var(--ink)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>{["Parameter","Tipe","Default","Deskripsi"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    <ParamRow name="usr" type="string" required def="—" desc="Username yang akan ditampilkan di kartu lobby. Maksimal 15 karakter." />
                    <ParamRow name="rank" type="string" required={false} def="imo" desc="Key rank yang digunakan. Lihat tabel rank di bawah." />
                    <ParamRow name="border" type="number" required={false} def="0 (default)" desc="Nomor border avatar (1–16). Jika 0 atau tidak diisi, pakai outline default." />
                    <ParamRow name="avatar" type="string (URL)" required={false} def="avatar default" desc="URL gambar avatar (harus diawali https://). Jika tidak diisi, pakai avatar default." />
                  </tbody>
                </table>
              </div>

              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 8, marginTop: 20 }}>Response Header</div>
              <div style={{ border: "2px solid var(--ink)", borderRadius: "var(--radius-sm)", overflow: "hidden", boxShadow: "2px 2px 0 0 var(--ink)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>{["Header","Nilai"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {[
                      ["Content-Type","image/png"],
                      ["Content-Disposition","inline; filename=\"ml-{username}-{rank}.png\""],
                      ["X-Username","username yang digunakan"],
                      ["X-Rank","rank yang digunakan"],
                      ["X-Border","nomor border yang digunakan"],
                      ["Cache-Control","no-store"],
                    ].map(([h, v], i) => (
                      <tr key={h} style={{ borderBottom: "1px solid rgba(26,26,26,0.1)", background: i % 2 === 0 ? "var(--paper)" : "var(--cream)" }}>
                        <td style={{ padding: "9px 14px" }}><code style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: "var(--ink)" }}>{h}</code></td>
                        <td style={{ padding: "9px 14px", fontSize: 12, color: "var(--ink-muted)", fontFamily: "monospace", fontWeight: 600 }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 8, marginTop: 20 }}>Contoh Request</div>
              <CodeBlock lang="bash" code={`curl -o output.png "https://${DOMAIN}/fake-ml?usr=SatriaML&rank=legend&border=3"`} />
              <CodeBlock lang="bash" code={`curl -o output.png "https://${DOMAIN}/fake-ml?usr=Mythic123&rank=mawi&avatar=https://i.imgur.com/abc.jpg"`} />
            </div>
          </Card>

          <Card>
            <CardHeader label="Daftar Rank ML" badge="7 rank" badgeColor="#c9a9f0" />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
                <thead>
                  <tr>{["Key (rank=)","Icon","Nama Rank","Warna"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {ML_RANKS.map((r, i) => (
                    <tr key={r.key} style={{ borderBottom: "1px solid rgba(26,26,26,0.1)", background: i % 2 === 0 ? "var(--paper)" : "var(--cream)" }}>
                      <td style={{ padding: "10px 14px" }}>
                        <code style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 800, background: "rgba(26,26,26,0.07)", padding: "3px 8px", borderRadius: 4 }}>rank={r.key}</code>
                      </td>
                      <td style={{ padding: "8px 14px" }}>
                        <img src={`/ml/rank/${r.key}.webp`} alt={r.label} style={{ width: 36, height: 36, objectFit: "contain" }} draggable={false} />
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 14, fontWeight: 700, color: r.color }}>{r.label}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 14, height: 14, borderRadius: "50%", background: r.color, border: "2px solid var(--ink)", flexShrink: 0 }} />
                          <code style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: "var(--ink-soft)" }}>{r.color}</code>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader label="Daftar Border ML" badge="16 border" badgeColor="#a8d0f0" />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 380 }}>
                <thead>
                  <tr>{["No","Preview","Nilai Parameter"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {ML_BORDERS.map((b, i) => (
                    <tr key={b.id} style={{ borderBottom: "1px solid rgba(26,26,26,0.1)", background: i % 2 === 0 ? "var(--paper)" : "var(--cream)" }}>
                      <td style={{ padding: "8px 14px", fontSize: 13, fontWeight: 800, color: "var(--ink-muted)", fontVariantNumeric: "tabular-nums" }}>{String(b.id).padStart(2,"0")}</td>
                      <td style={{ padding: "7px 14px" }}>
                        <div style={{ width: 52, height: 52, borderRadius: "var(--radius-sm)", overflow: "hidden", border: "2px solid rgba(26,26,26,0.2)", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "1px 1px 0 0 var(--ink)" }}>
                          <img src={b.img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} draggable={false} />
                        </div>
                      </td>
                      <td style={{ padding: "8px 14px" }}>
                        <code style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, background: "rgba(26,26,26,0.07)", padding: "3px 8px", borderRadius: 4 }}>border={b.id}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div id="error">
          <SectionTitle num="04">Error Response</SectionTitle>
          <Card>
            <CardHeader label="Format Error" badge="JSON" badgeColor="#ffb5a0" />
            <div style={{ padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-muted)", marginBottom: 12 }}>
                Jika terjadi error, response dikembalikan dalam format JSON dengan HTTP status code yang sesuai.
              </p>
              <CodeBlock lang="json" code={`{
  "error": "Pesan error",
  "example": "/fake-ff?usr=PlayerName&lobby=1"
}`} />
              <div style={{ marginTop: 16, border: "2px solid var(--ink)", borderRadius: "var(--radius-sm)", overflow: "hidden", boxShadow: "2px 2px 0 0 var(--ink)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>{["HTTP Status","Penyebab"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {[
                      ["400 Bad Request","Parameter wajib tidak diisi atau nilai tidak valid"],
                      ["500 Internal Server Error","Terjadi error di server saat memproses gambar"],
                    ].map(([s, d], i) => (
                      <tr key={s} style={{ borderBottom: "1px solid rgba(26,26,26,0.1)", background: i % 2 === 0 ? "var(--paper)" : "var(--cream)" }}>
                        <td style={{ padding: "10px 14px" }}><code style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 800, color: i === 0 ? "#c0392b" : "#7f3faa" }}>{s}</code></td>
                        <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--ink-soft)", fontWeight: 600 }}>{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        <div id="examples">
          <SectionTitle num="05">Contoh Penggunaan</SectionTitle>

          <Card>
            <CardHeader label="cURL" badge="Terminal" badgeColor="#ffe066" />
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-muted)", marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Free Fire — simpan ke file</div>
                <CodeBlock lang="bash" code={`curl -o ff_card.jpg "https://${DOMAIN}/fake-ff?usr=SatriaGaming&lobby=12"`} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-muted)", marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Mobile Legends — simpan ke file</div>
                <CodeBlock lang="bash" code={`curl -o ml_card.png "https://${DOMAIN}/fake-ml?usr=Satria&rank=legend&border=5"`} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-muted)", marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>ML dengan avatar custom</div>
                <CodeBlock lang="bash" code={`curl -o ml_card.png "https://${DOMAIN}/fake-ml?usr=Satria&rank=mawi&border=2&avatar=https://i.imgur.com/abc123.jpg"`} />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader label="Node.js / Baileys (WhatsApp Bot)" badge="WA Bot" badgeColor="#a8e8c9" />
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-muted)", marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Kirim kartu FF ke chat</div>
                <CodeBlock lang="javascript" code={`const axios = require("axios");

async function sendFFCard(sock, jid, username, lobby) {
  const url = \`https://${DOMAIN}/fake-ff?usr=\${encodeURIComponent(username)}&lobby=\${lobby}\`;
  const res = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(res.data);
  await sock.sendMessage(jid, {
    image: buffer,
    caption: \`🎮 Kartu Lobby FF — \${username}\`,
  });
}`} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-muted)", marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Kirim kartu ML ke chat</div>
                <CodeBlock lang="javascript" code={`async function sendMLCard(sock, jid, username, rank, border) {
  const url = \`https://${DOMAIN}/fake-ml?usr=\${encodeURIComponent(username)}&rank=\${rank}&border=\${border}\`;
  const res = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(res.data);
  await sock.sendMessage(jid, {
    image: buffer,
    caption: \`⚔️ Kartu Lobby ML — \${username} | \${rank}\`,
  });
}`} />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader label="Python (requests)" badge="Python" badgeColor="#a8d0f0" />
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-muted)", marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Download dan simpan gambar</div>
                <CodeBlock lang="python" code={`import requests

def get_ff_card(username, lobby=None):
    params = {"usr": username}
    if lobby:
        params["lobby"] = lobby
    res = requests.get(f"https://${DOMAIN}/fake-ff", params=params)
    if res.status_code == 200:
        with open("ff_card.jpg", "wb") as f:
            f.write(res.content)
        return True
    return False

def get_ml_card(username, rank="imo", border=0, avatar=None):
    params = {"usr": username, "rank": rank, "border": border}
    if avatar:
        params["avatar"] = avatar
    res = requests.get(f"https://${DOMAIN}/fake-ml", params=params)
    if res.status_code == 200:
        with open("ml_card.png", "wb") as f:
            f.write(res.content)
        return True
    return False`} />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader label="Telegram Bot (python-telegram-bot)" badge="TG Bot" badgeColor="#c9a9f0" />
            <div style={{ padding: 20 }}>
              <CodeBlock lang="python" code={`import requests
from telegram import Update
from telegram.ext import ContextTypes

async def ffcard_command(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    args = ctx.args
    if not args:
        await update.message.reply_text("Penggunaan: /ffcard <username> [lobby]")
        return
    username = args[0]
    lobby    = args[1] if len(args) > 1 else ""
    params   = {"usr": username}
    if lobby:
        params["lobby"] = lobby
    res = requests.get(f"https://${DOMAIN}/fake-ff", params=params)
    if res.status_code == 200:
        await update.message.reply_photo(photo=res.content, caption=f"🎮 {username}")
    else:
        await update.message.reply_text("Gagal generate kartu.")`} />
            </div>
          </Card>

          <Card>
            <CardHeader label="JavaScript / Fetch (Browser / Next.js)" badge="JS" badgeColor="#ffe066" />
            <div style={{ padding: 20 }}>
              <CodeBlock lang="javascript" code={`async function getFFCard(username, lobby) {
  const params = new URLSearchParams({ usr: username });
  if (lobby) params.append("lobby", lobby);
  const res = await fetch(\`https://${DOMAIN}/fake-ff?\${params}\`);
  if (!res.ok) throw new Error("Gagal generate");
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const img  = document.createElement("img");
  img.src    = url;
  document.body.appendChild(img);
}

async function getMLCard(username, rank = "imo", border = 0) {
  const params = new URLSearchParams({ usr: username, rank, border });
  const res = await fetch(\`https://${DOMAIN}/fake-ml?\${params}\`);
  if (!res.ok) throw new Error("Gagal generate");
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}`} />
            </div>
          </Card>
        </div>

        <footer style={{ textAlign: "center", paddingTop: 32, paddingBottom: 16 }}>
          <div style={{
            display: "inline-block",
            padding: "10px 24px",
            background: "var(--paper)",
            border: "2px solid var(--ink)",
            borderRadius: "999px",
            boxShadow: "2px 2px 0 0 var(--ink)",
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>SatriaCanvas API Docs</span>
          </div>
          <div style={{ marginTop: 12 }}>
            <a href="/" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-muted)", textDecoration: "underline", textUnderlineOffset: 3 }}>← Kembali ke Generator</a>
          </div>
        </footer>

      </div>
    </main>
  );
}
