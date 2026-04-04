import { useState, useEffect } from "react";
import { DB } from "../config/firebase";
import { CHARCOAL, TEAL, LTGREY, MIDGREY, RUST, WHITE } from "../constants/colors";
import { css } from "../constants/styles";
import { SITUATIONS, FAMILY_ROLES, FAMILY_EXPERIENCE } from "../constants/data";
import { RootsIcon, CrossIcon } from "../components/icons";
import { GoldButton, LoadingState } from "../components/ui";

export function AdvisorScreen({ user }) {
  const [step,       setStep]       = useState("home");
  const [situation,  setSituation]  = useState(null);
  const [customSit,  setCustomSit]  = useState("");
  const [details,    setDetails]    = useState("");
  const [role,       setRole]       = useState(null);
  const [experience, setExperience] = useState("");
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [history,    setHistory]    = useState([]);
  const [activeTab,    setActiveTab]    = useState("advice");
  const [error,        setError]        = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    if (!user) return;
    DB.getFamilySessions(user.uid).then(setHistory).catch(() => {});
  }, [user]);

  const reset = () => { setStep("home"); setSituation(null); setDetails(""); setRole(null); setExperience(""); setResult(null); setCustomSit(""); setError(null); };

  const getAdvice = async () => {
    if (!details.trim()) return;
    setLoading(true); setError(null);
    try {
      const API  = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";
      const res  = await fetch(`${API}/api/family-compass`, {
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, details, role, experience }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || res.statusText);
      }
      const parsed = await res.json();
      parsed.situation  = situation;
      parsed.timestamp  = new Date().toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit" });
      setResult(parsed);
      setHistory(h => [parsed, ...h.slice(0, 9)]);
      setStep("result");
      if (user) await DB.saveFamilySession(user.uid, { situation, details, role, experience, ...parsed });
    } catch { setError("Could not generate guidance. Please try again."); }
    finally  { setLoading(false); }
  };

  // ── Home ──
  if (step === "home") return (
    <div style={{ height:"100%", overflowY:"auto", padding:"0 20px 100px" }}>
      <div style={{ padding:"32px 0 20px" }}>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:700, color:CHARCOAL, margin:"0 0 4px" }}>Family Roots</h1>
        <p style={{ fontFamily:"Georgia,serif", fontSize:12, color:MIDGREY, margin:0 }}>Faith-based guidance for your family's toughest moments</p>
      </div>

      {/* Toggle */}
      <div style={{ display:"flex", background:"rgba(255,255,255,0.5)", borderRadius:12, padding:3, marginBottom:18, border:"1px solid rgba(46,125,107,0.15)" }}>
        {[["advice","Get Guidance"], ["history", `History (${history.length})`]].map(([t, lbl]) => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flex:1, border:"none", borderRadius:10, padding:10, fontFamily:"Georgia,serif", fontSize:12, fontWeight:600, cursor:"pointer", background: activeTab===t ? TEAL : "transparent", color: activeTab===t ? WHITE : MIDGREY, transition:"all 0.2s", textTransform:"uppercase", letterSpacing:"0.05em" }}>{lbl}</button>
        ))}
      </div>

      {activeTab === "history" ? (
        history.length === 0
          ? <p style={{ fontFamily:"Georgia,serif", fontSize:14, color:LTGREY, fontStyle:"italic", textAlign:"center", padding:"60px 0" }}>Your past Family Roots sessions will appear here.</p>
          : <>
            {history.slice(0, visibleCount).map((h, i) => (
              <div key={i} onClick={() => { setResult(h); setStep("result"); }} style={{ ...css.card, cursor:"pointer", display:"flex", alignItems:"flex-start", gap:10, marginBottom:12 }}>
                <span style={{ fontSize:20 }}>{h.situation?.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:"Georgia,serif", fontSize:14, fontWeight:700, color:CHARCOAL, margin:"0 0 2px" }}>{h.situation?.label}</p>
                  <p style={{ fontFamily:"Georgia,serif", fontSize:11, color:LTGREY, margin:"0 0 4px" }}>{h.timestamp}</p>
                  <p style={{ fontFamily:"Georgia,serif", fontSize:12, fontStyle:"italic", color:MIDGREY, margin:0 }}>"{h.headline}"</p>
                </div>
                <span style={{ color:TEAL, fontSize:18 }}>›</span>
              </div>
            ))}
            {history.length > visibleCount && (
              <button
                onClick={() => setVisibleCount(c => c + 10)}
                style={{ display:"block", width:"100%", background:"transparent", border:`1.5px solid rgba(46,125,107,0.3)`, borderRadius:12, padding:"12px 0", fontFamily:"Georgia,serif", fontSize:13, fontWeight:600, color:TEAL, cursor:"pointer", marginBottom:16 }}
              >
                Load More ({history.length - visibleCount} remaining)
              </button>
            )}
          </>
      ) : (
        <>
          <div style={css.darkCard}>
            <div style={{ position:"absolute", right:-16, bottom:-16, opacity:0.07 }}><RootsIcon size={120} color={WHITE}/></div>
            <p style={{ fontFamily:"Georgia,serif", fontSize:11, fontWeight:600, color:TEAL, letterSpacing:"0.14em", textTransform:"uppercase", margin:"0 0 10px" }}>✦  How It Works</p>
            <p style={{ fontFamily:"Georgia,serif", fontSize:13.5, color:"rgba(253,250,245,0.9)", margin:0, lineHeight:1.7 }}>Describe what your family is facing. Family Roots responds with Scripture-grounded truth, practical wisdom, and honest next steps — grace for your family's hardest moments.</p>
          </div>

          <label style={{ ...css.label, display:"block", marginBottom:12 }}>Choose Your Situation</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
            {SITUATIONS.map(sit => (
              <button key={sit.label} onClick={() => { setSituation(sit); setStep("form"); }} style={{ background:"rgba(255,255,255,0.75)", border:"1.5px solid rgba(46,125,107,0.2)", borderRadius:14, padding:"14px 12px", cursor:"pointer", textAlign:"left" }}>
                <span style={{ fontSize:22, display:"block", marginBottom:6 }}>{sit.icon}</span>
                <p style={{ fontFamily:"Georgia,serif", fontSize:13, fontWeight:600, color:CHARCOAL, margin:"0 0 3px", lineHeight:1.3 }}>{sit.label}</p>
                <p style={{ fontFamily:"Georgia,serif", fontSize:11, color:LTGREY, margin:0, lineHeight:1.4 }}>{sit.desc}</p>
              </button>
            ))}
          </div>

          <div style={css.card}>
            <label style={css.label}>Or Describe Your Own Situation</label>
            <div style={{ display:"flex", gap:10 }}>
              <input value={customSit} onChange={e => setCustomSit(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter" && customSit.trim()) { setSituation({ icon:"✏️", label:customSit, desc:"Custom" }); setStep("form"); }}}
                placeholder="e.g. My kids won't stop fighting…"
                style={{ ...css.input, flex:1 }} />
              <button onClick={() => { if (customSit.trim()) { setSituation({ icon:"✏️", label:customSit, desc:"Custom" }); setStep("form"); }}} disabled={!customSit.trim()}
                style={{ background: customSit.trim() ? TEAL : "#A8C5BC", color:WHITE, border:"none", borderRadius:10, padding:"0 16px", fontFamily:"Georgia,serif", fontSize:13, fontWeight:600, cursor: customSit.trim() ? "pointer" : "default" }}>Go</button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // ── Form ──
  if (step === "form") return (
    <div style={{ height:"100%", overflowY:"auto", padding:"0 20px 100px" }}>
      <div style={{ padding:"24px 0 16px", display:"flex", alignItems:"center", gap:10 }}>
        <button onClick={reset} style={{ background:"none", border:"none", cursor:"pointer", padding:0, color:MIDGREY, fontSize:22 }}>‹</button>
        <span style={{ fontSize:26 }}>{situation?.icon}</span>
        <div>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:CHARCOAL, margin:0 }}>{situation?.label}</h2>
          <p style={{ fontFamily:"Georgia,serif", fontSize:12, color:MIDGREY, margin:0 }}>{situation?.desc}</p>
        </div>
      </div>

      <div style={css.card}>
        <label style={css.label}>Describe Your Situation *</label>
        <textarea value={details} onChange={e => setDetails(e.target.value)} rows={5}
          placeholder="Be specific — what's happening, who's involved, what have you tried? The more honest you are, the more grounded the guidance."
          style={{ ...css.input, resize:"none", lineHeight:1.8, height:120 }} />

        <label style={{ ...css.label, marginTop:18 }}>Your Family Role</label>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:18 }}>
          {FAMILY_ROLES.map(r => (
            <button key={r.id} onClick={() => setRole(r.id === role ? null : r.id)}
              style={{ border:`1.5px solid ${role===r.id ? TEAL : "rgba(46,125,107,0.25)"}`, borderRadius:11, padding:"10px 12px", textAlign:"left", cursor:"pointer", background: role===r.id ? "rgba(46,125,107,0.1)" : "transparent" }}>
              <p style={{ fontFamily:"Georgia,serif", fontSize:13, fontWeight:600, color: role===r.id ? TEAL : CHARCOAL, margin:"0 0 2px" }}>{r.label}</p>
              <p style={{ fontFamily:"Georgia,serif", fontSize:10, color:LTGREY, margin:0 }}>{r.sub}</p>
            </button>
          ))}
        </div>

        <label style={css.label}>Family Experience Level</label>
        <div style={{ display:"flex", gap:8, marginBottom:22 }}>
          {FAMILY_EXPERIENCE.map(e => (
            <button key={e.id} onClick={() => setExperience(experience===e.id ? "" : e.id)}
              style={{ flex:1, border:`1.5px solid ${experience===e.id ? TEAL : "rgba(46,125,107,0.25)"}`, borderRadius:11, padding:"8px 4px", textAlign:"center", cursor:"pointer", background: experience===e.id ? "rgba(46,125,107,0.1)" : "transparent" }}>
              <p style={{ fontFamily:"Georgia,serif", fontSize:11, fontWeight:700, color: experience===e.id ? TEAL : CHARCOAL, margin:"0 0 2px", lineHeight:1.3 }}>{e.label}</p>
              <p style={{ fontFamily:"Georgia,serif", fontSize:9, color:LTGREY, margin:0, lineHeight:1.4 }}>{e.sub}</p>
            </button>
          ))}
        </div>

        {error && <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#C05050", textAlign:"center", margin:"0 0 14px" }}>{error}</p>}
        <GoldButton onClick={getAdvice} disabled={!details.trim() || loading}>{loading ? "Seeking wisdom…" : "Get Family Guidance"}</GoldButton>
        {loading && <div style={{ marginTop:20 }}><LoadingState msg="Searching Scripture for your family…"/></div>}
      </div>
    </div>
  );

  // ── Result ──
  if (step === "result" && result) return (
    <div style={{ height:"100%", overflowY:"auto", padding:"0 20px 100px" }}>
      <div style={{ padding:"24px 0 14px", display:"flex", alignItems:"center", gap:10 }}>
        <button onClick={reset} style={{ background:"none", border:"none", cursor:"pointer", padding:0, color:MIDGREY, fontSize:22 }}>‹</button>
        <span style={{ fontSize:22 }}>{result.situation?.icon}</span>
        <p style={{ fontFamily:"Georgia,serif", fontSize:12, fontWeight:600, color:MIDGREY, margin:0, textTransform:"uppercase", letterSpacing:"0.1em" }}>{result.situation?.label}</p>
      </div>

      {/* Core Truth */}
      <div style={css.darkCard}>
        <div style={{ position:"absolute", right:-20, bottom:-20, opacity:0.06 }}><RootsIcon size={130} color={WHITE}/></div>
        <p style={{ fontFamily:"Georgia,serif", fontSize:10, fontWeight:600, color:TEAL, letterSpacing:"0.16em", textTransform:"uppercase", margin:"0 0 10px" }}>✦  Core Truth</p>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:WHITE, margin:"0 0 12px", lineHeight:1.35 }}>"{result.headline}"</h2>
        <p style={{ fontFamily:"Georgia,serif", fontSize:13.5, color:"rgba(253,250,245,0.85)", margin:0, lineHeight:1.75 }}>{result.coretruth}</p>
      </div>

      {/* Scripture */}
      <div style={css.card}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
          <CrossIcon size={13}/><label style={{ ...css.label, margin:0 }}>Scripture Foundation</label>
        </div>
        {result.scriptures?.map((s, i) => (
          <div key={i} style={{ marginBottom: i < result.scriptures.length-1 ? 14 : 0, paddingBottom: i < result.scriptures.length-1 ? 14 : 0, borderBottom: i < result.scriptures.length-1 ? "1px solid rgba(46,125,107,0.12)" : "none" }}>
            <p style={{ fontFamily:"Georgia,serif", fontSize:14, fontStyle:"italic", color:CHARCOAL, margin:"0 0 5px", lineHeight:1.65 }}>"{s.verse}"</p>
            <p style={{ fontFamily:"Georgia,serif", fontSize:11, fontWeight:600, color:TEAL, margin:"0 0 5px" }}>— {s.reference}</p>
            <p style={{ fontFamily:"Georgia,serif", fontSize:12.5, color:"#6A5A4A", margin:0, lineHeight:1.6, fontStyle:"italic" }}>↳ {s.application}</p>
          </div>
        ))}
      </div>

      {/* Framework */}
      {result.framework && (
        <div style={{ ...css.card, background:"rgba(46,125,107,0.08)" }}>
          <label style={css.label}>Family Wisdom Framework</label>
          <p style={{ fontFamily:"Georgia,serif", fontSize:15, fontWeight:700, color:TEAL, margin:"0 0 8px" }}>{result.framework.name}</p>
          <p style={{ fontFamily:"Georgia,serif", fontSize:13.5, color:"#3D3A36", margin:0, lineHeight:1.7 }}>{result.framework.insight}</p>
        </div>
      )}

      {/* Actions */}
      <div style={css.card}>
        <label style={{ ...css.label, marginBottom:14 }}>🎯  Action Steps</label>
        {result.actions?.map((a, i) => (
          <div key={i} style={{ display:"flex", gap:12, marginBottom: i < result.actions.length-1 ? 12 : 0, alignItems:"flex-start" }}>
            <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#2E7D6B,#3A9E88)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
              <span style={{ fontFamily:"Georgia,serif", fontSize:12, fontWeight:700, color:WHITE }}>{i+1}</span>
            </div>
            <p style={{ fontFamily:"Georgia,serif", fontSize:13.5, color:CHARCOAL, margin:0, lineHeight:1.7 }}>{a}</p>
          </div>
        ))}
      </div>

      {/* Caution */}
      {result.caution && (
        <div style={{ background:"rgba(180,80,50,0.06)", borderRadius:14, padding:"14px 18px", marginBottom:14, border:"1px solid rgba(180,80,50,0.18)", borderLeft:`4px solid ${RUST}` }}>
          <p style={{ fontFamily:"Georgia,serif", fontSize:10, fontWeight:600, color:"#A04020", letterSpacing:"0.14em", textTransform:"uppercase", margin:"0 0 6px" }}>⚠  Watch Out For</p>
          <p style={{ fontFamily:"Georgia,serif", fontSize:13.5, color:"#3D3A36", margin:0, lineHeight:1.7 }}>{result.caution}</p>
        </div>
      )}

      {/* Prayer Focus */}
      {result.prayer_focus && (
        <div style={{ background:"rgba(45,43,40,0.04)", borderRadius:14, padding:"14px 18px", marginBottom:14, border:"1px dashed rgba(46,125,107,0.35)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
            <CrossIcon size={13}/><label style={{ ...css.label, margin:0 }}>Prayer Focus</label>
          </div>
          <p style={{ fontFamily:"Georgia,serif", fontSize:13.5, color:"#3D3A36", margin:0, lineHeight:1.7, fontStyle:"italic" }}>{result.prayer_focus}</p>
        </div>
      )}

      <GoldButton outline onClick={reset}>+ New Family Situation</GoldButton>
    </div>
  );

  return null;
}
