import { useState, useEffect } from "react";
import { DB } from "../config/firebase";
import { CHARCOAL, TEAL, LTGREY, MIDGREY, WHITE } from "../constants/colors";
import { css } from "../constants/styles";
import { TOPICS, AGE_RANGES, TOPIC_CATEGORIES, DEVOTION_PERSPECTIVES, CHILD_INTEREST_ANGLES } from "../constants/data";
import { RootsIcon, CrossIcon } from "../components/icons";
import { GoldButton, LoadingState, Divider } from "../components/ui";
import { SavedDevotionsScreen, DevotionDetail, shareDevotion } from "./SavedDevotionsScreen";

export function DevotionScreen({ user, pendingTopic, onTopicConsumed }) {
  const [topic,            setTopic]            = useState("");
  const [ageRanges,        setAgeRanges]        = useState([]);
  const [perspective,      setPerspective]      = useState("parent");
  const [interestCategory, setInterestCategory] = useState(null);
  const [interestTopic,    setInterestTopic]    = useState(null);
  const [showTopicPicker,  setShowTopicPicker]  = useState(false);
  const [devotion,         setDevotion]         = useState(null);
  const [loading,          setLoading]          = useState(false);
  const [saved,            setSaved]            = useState(false);
  const [error,            setError]            = useState(null);
  const [recentDevotions,  setRecentDevotions]  = useState([]);
  const [showHistory,      setShowHistory]      = useState(false);
  const [selectedDevotion, setSelectedDevotion] = useState(null);

  useEffect(() => {
    if (pendingTopic) {
      setTopic(pendingTopic);
      onTopicConsumed?.();
    }
  }, [pendingTopic]);

  useEffect(() => {
    if (!user) return;
    DB.getSavedDevotions(user.uid).then(all => setRecentDevotions(all.slice(0, 5)));
  }, [user]);

  const toggleAge = (id) =>
    setAgeRanges(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);

  const selectPerspective = (id) => {
    setPerspective(id);
    if (id !== "child" && id !== "together") {
      setInterestCategory(null);
      setInterestTopic(null);
    }
  };

  const selectInterestCategory = (cat) => {
    if (interestCategory === cat) {
      setInterestCategory(null);
      setInterestTopic(null);
    } else {
      setInterestCategory(cat);
      setInterestTopic(null);
    }
  };

  const showInterestPicker = perspective === "child" || perspective === "together";

  const generate = async (forceTopic) => {
    const t = forceTopic || topic || TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const ageLabels = AGE_RANGES.filter(a => ageRanges.includes(a.id)).map(a => `${a.label} (${a.sub})`);
    setLoading(true); setDevotion(null); setSaved(false); setError(null);
    try {
      const API = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";
      const res = await fetch(`${API}/api/devotion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t, ageRanges: ageLabels, perspective, childInterest: interestTopic || null }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`API Error: ${res.status} - ${errorData.error || res.statusText}`);
      }
      const parsed = await res.json();
      parsed.topic = t;
      setDevotion(parsed);
      if (forceTopic) setTopic(forceTopic);
    } catch (err) {
      setError(`Could not generate devotion: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveDevotion = async () => {
    if (!devotion || !user) return;
    setSaved(true);
    try {
      await DB.saveDevotions(user.uid, {
        title: devotion.title, topic: devotion.topic,
        scripture: devotion.scripture, body: devotion.body,
        analogy: devotion.analogy || null,
        reflection: devotion.reflection, prayer: devotion.prayer,
      });
    } catch { /* silent — already marked saved in UI */ }
  };

  if (selectedDevotion) {
    return <DevotionDetail devotion={selectedDevotion} onBack={() => setSelectedDevotion(null)} />;
  }
  if (showHistory) {
    return <SavedDevotionsScreen user={user} onBack={() => setShowHistory(false)} />;
  }

  const formatDate = (ts) => {
    if (!ts?.toDate) return "";
    return ts.toDate().toLocaleDateString("en-US", { month:"short", day:"numeric" });
  };

  return (
    <div style={{ padding:"0 20px 100px", overflowY:"auto", height:"100%" }}>
      <div style={{ textAlign:"center", padding:"32px 0 24px" }}>
        <RootsIcon size={44} />
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:26, fontWeight:700, color:CHARCOAL, margin:"12px 0 4px" }}>Family Devotions</h1>
        <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#7A7672", margin:0 }}>Scripture-grounded devotions for every season of family life.</p>
      </div>

      {/* Age range selector */}
      <div style={css.card}>
        <label style={css.label}>Who's in your family?</label>
        <p style={{ fontFamily:"Georgia,serif", fontSize:11, color:LTGREY, margin:"0 0 10px" }}>Select all ages so the devotion fits your family.</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {AGE_RANGES.map(({ id, label, sub }) => {
            const active = ageRanges.includes(id);
            return (
              <button key={id} onClick={() => toggleAge(id)} style={{ border:`1.5px solid ${active ? TEAL : "rgba(46,125,107,0.3)"}`, borderRadius:20, padding:"6px 14px", fontFamily:"Georgia,serif", fontSize:12, fontWeight:600, color: active ? WHITE : MIDGREY, background: active ? TEAL : "transparent", cursor:"pointer" }}>
                {label}
                <span style={{ fontSize:10, fontWeight:400, marginLeft:4, opacity:0.75 }}>{sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Perspective selector */}
      <div style={css.card}>
        <label style={css.label}>Devotion Perspective</label>
        <p style={{ fontFamily:"Georgia,serif", fontSize:11, color:LTGREY, margin:"0 0 10px" }}>Who is this devotion speaking to?</p>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {DEVOTION_PERSPECTIVES.map(({ id, label, sub, icon }) => {
            const active = perspective === id;
            return (
              <button key={id} onClick={() => selectPerspective(id)}
                style={{ display:"flex", alignItems:"center", gap:12, border:`1.5px solid ${active ? TEAL : "rgba(46,125,107,0.25)"}`, borderRadius:12, padding:"10px 14px", background: active ? "rgba(46,125,107,0.08)" : "transparent", cursor:"pointer", textAlign:"left" }}>
                <span style={{ fontSize:20 }}>{icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:"Georgia,serif", fontSize:13, fontWeight:700, color: active ? TEAL : CHARCOAL, margin:0 }}>{label}</p>
                  <p style={{ fontFamily:"Georgia,serif", fontSize:11, color:MIDGREY, margin:0 }}>{sub}</p>
                </div>
                <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${active ? TEAL : "rgba(46,125,107,0.3)"}`, background: active ? TEAL : "transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {active && <div style={{ width:8, height:8, borderRadius:"50%", background:WHITE }}/>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Learning angle picker — shown for child/together perspectives */}
      {showInterestPicker && (
        <div style={css.card}>
          <label style={css.label}>Learning Angle <span style={{ fontWeight:400, color:LTGREY }}>(optional)</span></label>
          <p style={{ fontFamily:"Georgia,serif", fontSize:11, color:LTGREY, margin:"0 0 10px" }}>
            Weave a subject your child loves into the devotion's illustrations.
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom: interestCategory ? 12 : 0 }}>
            {CHILD_INTEREST_ANGLES.map(({ icon, label }) => {
              const active = interestCategory === label;
              return (
                <button key={label} onClick={() => selectInterestCategory(label)}
                  style={{ border:`1.5px solid ${active ? TEAL : "rgba(46,125,107,0.3)"}`, borderRadius:20, padding:"6px 12px", fontFamily:"Georgia,serif", fontSize:12, fontWeight:600, color: active ? WHITE : MIDGREY, background: active ? TEAL : "transparent", cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                  <span>{icon}</span>{label}
                </button>
              );
            })}
          </div>
          {interestCategory && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, paddingTop:4, borderTop:"1px solid rgba(46,125,107,0.12)" }}>
              {CHILD_INTEREST_ANGLES.find(c => c.label === interestCategory)?.topics.map(t => {
                const active = interestTopic === t;
                return (
                  <button key={t} onClick={() => setInterestTopic(prev => prev === t ? null : t)}
                    style={{ border:`1.5px solid ${active ? TEAL : "rgba(46,125,107,0.25)"}`, borderRadius:20, padding:"5px 11px", fontFamily:"Georgia,serif", fontSize:11, fontWeight: active ? 700 : 400, color: active ? WHITE : MIDGREY, background: active ? TEAL : "rgba(46,125,107,0.04)", cursor:"pointer" }}>
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Topic selector */}
      <div style={css.card}>
        <label style={css.label}>Topic</label>
        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
          <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key==="Enter" && topic && generate()}
            placeholder="e.g. patience, forgiveness…"
            style={{ ...css.input, flex:1, marginBottom:0 }} />
          <button onClick={() => setShowTopicPicker(true)}
            style={{ background:"rgba(46,125,107,0.1)", color:TEAL, border:"1.5px solid rgba(46,125,107,0.3)", borderRadius:10, padding:"0 14px", fontFamily:"Georgia,serif", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
            Browse
          </button>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => generate()} disabled={!topic || loading}
            style={{ flex:1, background: topic && !loading ? TEAL : "#A8C5BC", color:WHITE, border:"none", borderRadius:10, padding:12, fontFamily:"Georgia,serif", fontSize:13, fontWeight:600, cursor: topic && !loading ? "pointer" : "default" }}>
            Generate Devotion
          </button>
        </div>
        <Divider />
        <GoldButton outline onClick={() => generate(TOPICS[Math.floor(Math.random()*TOPICS.length)])} disabled={loading}>✦  Surprise Me</GoldButton>
      </div>

      {/* Topic picker overlay */}
      {showTopicPicker && (
        <div style={{ position:"absolute", inset:0, background:"rgba(45,43,40,0.55)", zIndex:100, display:"flex", alignItems:"flex-end" }}>
          <div style={{ background:"#FDFAF5", borderRadius:"24px 24px 0 0", width:"100%", maxHeight:"80%", display:"flex", flexDirection:"column", boxSizing:"border-box" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 20px 12px", flexShrink:0 }}>
              <h3 style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:700, color:CHARCOAL, margin:0 }}>Choose a Topic</h3>
              <button onClick={() => setShowTopicPicker(false)} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:MIDGREY, padding:0 }}>✕</button>
            </div>
            <div style={{ overflowY:"auto", padding:"0 20px 32px" }}>
              {TOPIC_CATEGORIES.map(({ label: catLabel, topics }) => (
                <div key={catLabel} style={{ marginBottom:20 }}>
                  <p style={{ fontFamily:"Georgia,serif", fontSize:11, fontWeight:600, color:TEAL, letterSpacing:"0.12em", textTransform:"uppercase", margin:"0 0 10px" }}>{catLabel}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {topics.map(t => (
                      <button key={t} onClick={() => { setTopic(t); setShowTopicPicker(false); }}
                        style={{ border:"1.5px solid rgba(46,125,107,0.3)", borderRadius:20, padding:"6px 13px", fontFamily:"Georgia,serif", fontSize:12, color:MIDGREY, background: topic === t ? "rgba(46,125,107,0.1)" : "transparent", cursor:"pointer" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent devotions */}
      {recentDevotions.length > 0 && !devotion && !loading && (
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <p style={{ fontFamily:"Georgia,serif", fontSize:13, fontWeight:600, color:CHARCOAL, margin:0 }}>Recent Devotions</p>
            <button onClick={() => setShowHistory(true)} style={{ background:"none", border:"none", fontFamily:"Georgia,serif", fontSize:12, color:TEAL, cursor:"pointer", padding:0, fontWeight:600 }}>View all ›</button>
          </div>
          {recentDevotions.map(d => (
            <div key={d.id} onClick={() => setSelectedDevotion(d)}
              style={{ background:"rgba(255,255,255,0.75)", borderRadius:12, padding:"12px 14px", marginBottom:8, border:"1px solid rgba(46,125,107,0.15)", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:"Georgia,serif", fontSize:13, fontWeight:700, color:CHARCOAL, margin:"0 0 2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{d.title}</p>
                <p style={{ fontFamily:"Georgia,serif", fontSize:11, color:TEAL, margin:"0 0 2px" }}>{d.scripture?.reference}</p>
                <p style={{ fontFamily:"Georgia,serif", fontSize:10, color:LTGREY, margin:0 }}>{d.topic} · {formatDate(d.savedAt)}</p>
              </div>
              <span style={{ color:MIDGREY, fontSize:16, flexShrink:0 }}>›</span>
            </div>
          ))}
        </div>
      )}

      {loading && <LoadingState msg="Preparing your family devotion…" />}
      {error   && <div style={{ background:"#FFF0F0", border:"1px solid #F5C5C5", borderRadius:12, padding:16, textAlign:"center" }}><p style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#C05050", margin:0 }}>{error}</p></div>}

      {devotion && !loading && (
        <div style={{ ...css.card, padding:0, overflow:"hidden" }}>
          <div style={{ background:"linear-gradient(135deg,#2E7D6B,#3A9E88)", height:5 }}/>
          <div style={{ padding:"22px 20px" }}>
            <span style={{ display:"inline-block", background:"rgba(46,125,107,0.12)", color:TEAL, fontFamily:"Georgia,serif", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", padding:"4px 12px", borderRadius:20, marginBottom:14 }}>
              {devotion.topic}
            </span>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:CHARCOAL, margin:"0 0 18px", lineHeight:1.35 }}>{devotion.title}</h2>

            {/* Scripture */}
            <div style={{ background:"rgba(46,125,107,0.07)", borderLeft:`3px solid ${TEAL}`, borderRadius:"0 12px 12px 0", padding:"14px 16px", marginBottom:18 }}>
              <p style={{ fontFamily:"Georgia,serif", fontSize:14, fontStyle:"italic", color:CHARCOAL, margin:"0 0 6px", lineHeight:1.65 }}>"{devotion.scripture?.verse}"</p>
              <p style={{ fontFamily:"Georgia,serif", fontSize:11, fontWeight:600, color:TEAL, margin:0 }}>— {devotion.scripture?.reference}</p>
            </div>

            {/* Body */}
            {devotion.body?.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontFamily:"Georgia,serif", fontSize:14.5, color:"#3D3A36", lineHeight:1.8, margin:"0 0 14px" }}>{para}</p>
            ))}

            {/* Analogy */}
            {devotion.analogy && (
              <div style={{ background:"rgba(45,43,40,0.04)", borderRadius:12, padding:"14px 16px", margin:"0 0 16px", border:"1px solid rgba(45,43,40,0.08)" }}>
                <p style={{ fontFamily:"Georgia,serif", fontSize:11, fontWeight:600, color:MIDGREY, letterSpacing:"0.12em", textTransform:"uppercase", margin:"0 0 8px" }}>A Picture of This</p>
                <p style={{ fontFamily:"Georgia,serif", fontSize:14, color:"#3D3A36", margin:0, lineHeight:1.75 }}>{devotion.analogy}</p>
              </div>
            )}

            {/* Reflect */}
            <div style={{ background:WHITE, borderRadius:12, padding:16, margin:"16px 0", border:"1px dashed rgba(46,125,107,0.4)" }}>
              <p style={{ fontFamily:"Georgia,serif", fontSize:11, fontWeight:600, color:TEAL, letterSpacing:"0.12em", textTransform:"uppercase", margin:"0 0 8px" }}>Reflect</p>
              <p style={{ fontFamily:"Georgia,serif", fontSize:14, fontStyle:"italic", color:CHARCOAL, margin:0, lineHeight:1.7 }}>{devotion.reflection}</p>
            </div>

            {/* Prayer */}
            <div style={{ background:"rgba(45,43,40,0.04)", borderRadius:12, padding:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
                <CrossIcon size={14}/><p style={{ fontFamily:"Georgia,serif", fontSize:11, fontWeight:600, color:TEAL, letterSpacing:"0.12em", textTransform:"uppercase", margin:0 }}>Closing Prayer</p>
              </div>
              <p style={{ fontFamily:"Georgia,serif", fontSize:14, fontStyle:"italic", color:"#3D3A36", margin:0, lineHeight:1.7 }}>{devotion.prayer}</p>
            </div>

            {/* Actions */}
            <div style={{ display:"flex", gap:10, marginTop:18 }}>
              <button onClick={saveDevotion} style={{ flex:1, border:`1.5px solid ${saved ? TEAL : "rgba(46,125,107,0.3)"}`, borderRadius:10, padding:12, fontFamily:"Georgia,serif", fontSize:13, fontWeight:600, color: saved ? WHITE : TEAL, background: saved ? TEAL : "transparent", cursor:"pointer" }}>
                {saved ? "✓ Saved" : "Save"}
              </button>
              <button onClick={() => shareDevotion(devotion)} style={{ flex:1, border:"1.5px solid rgba(45,43,40,0.2)", borderRadius:10, padding:12, fontFamily:"Georgia,serif", fontSize:13, fontWeight:600, color:CHARCOAL, background:"transparent", cursor:"pointer" }}>Share</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
