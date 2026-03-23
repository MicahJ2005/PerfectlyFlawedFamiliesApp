import { useState, useEffect } from "react";
import { CHARCOAL, TEAL, LTGREY, MIDGREY, WHITE } from "../constants/colors";
import { css } from "../constants/styles";
import { TOPICS } from "../constants/data";
import { VERSES } from "../constants/verses";
import { RootsIcon } from "../components/icons";
import { useTheme } from "../context/ThemeContext";
import { DB } from "../config/firebase";

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function HomeScreen({ user, setTab, onTopicSelect }) {
  const { darkMode } = useTheme();
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today     = new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });
  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "friend";
  const [verse,         setVerse]         = useState(null);
  const [visibleTopics, setVisibleTopics] = useState(() => pickRandom(TOPICS, 10));

  useEffect(() => {
    DB.seedVerses(VERSES)
      .then(() => DB.getRandomVerse())
      .then(v => setVerse(v))
      .catch(() => setVerse(VERSES[Math.floor(Math.random() * VERSES.length)]));
    setVisibleTopics(pickRandom(TOPICS, 10));
  }, []);

  return (
    <div style={{ padding:"0 20px 100px", overflowY:"auto", height:"100%" }}>
      <div style={{ padding:"32px 0 16px", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <p style={{ fontFamily:"Georgia,serif", fontSize:12, color:LTGREY, margin:"0 0 2px", letterSpacing:"0.08em" }}>{today}</p>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:CHARCOAL, margin:"0 0 2px" }}>{greeting}, {firstName}.</h1>
          <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:MIDGREY, margin:0 }}>Perfectly Flawed Families</p>
        </div>
        <RootsIcon size={36} />
      </div>

      {/* Verse of the day */}
      <div style={{ ...css.darkCard, filter: darkMode ? "invert(1) hue-rotate(180deg)" : "none" }}>
        <div style={{ position:"absolute", right:-20, top:-20, opacity:0.06 }}><RootsIcon size={140} color={WHITE}/></div>
        <p style={{ fontFamily:"Georgia,serif", fontSize:11, fontWeight:600, color:TEAL, letterSpacing:"0.14em", textTransform:"uppercase", margin:"0 0 12px" }}>✦  Verse of the Day</p>
        <p style={{ fontFamily:"Georgia,serif", fontSize:15, fontStyle:"italic", color:"rgba(253,250,245,0.9)", margin:"0 0 12px", lineHeight:1.7 }}>"{verse ? verse.text : "…"}"</p>
        <p style={{ fontFamily:"Georgia,serif", fontSize:12, color:TEAL, margin:0, fontWeight:600 }}>— {verse ? verse.ref : ""}</p>
      </div>

      {/* Quick actions */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        {[
          { label:"Family Devotion",   sub:"Built for your family",          icon:"📖", tab:1, teal:true  },
          { label:"Family Roots",      sub:"Faith-based family guidance",    icon:"🌳", tab:2, teal:false },
          { label:"Family Prayer",     sub:"Community prayer wall",         icon:"🙏", tab:3, teal:false },
          { label:"Your Profile",      sub:"Stats & saved content",         icon:"✨", tab:4, teal:false },
        ].map(({ label, sub, icon, tab, teal }) => (
          <button key={tab} onClick={() => setTab(tab)} style={{ background: teal ? "linear-gradient(135deg,#2E7D6B,#3A9E88)" : "rgba(255,255,255,0.8)", border: teal ? "none" : "1px solid rgba(46,125,107,0.2)", borderRadius:16, padding:"18px 14px", cursor:"pointer", textAlign:"left", boxShadow: teal ? "0 6px 20px rgba(46,125,107,0.35)" : "0 2px 10px rgba(45,43,40,0.06)" }}>
            <span style={{ fontSize:22, display:"block", marginBottom:8 }}>{icon}</span>
            <p style={{ fontFamily:"Georgia,serif", fontSize:14, fontWeight:700, color: teal ? WHITE : CHARCOAL, margin:"0 0 3px" }}>{label}</p>
            <p style={{ fontFamily:"Georgia,serif", fontSize:11, color: teal ? "rgba(255,255,255,0.75)" : MIDGREY, margin:0 }}>{sub}</p>
          </button>
        ))}
      </div>

      {/* Topics */}
      <div style={css.card}>
        <label style={css.label}>Family Topics to Explore</label>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {visibleTopics.map(t => (
            <button key={t} onClick={() => onTopicSelect(t)} style={{ border:"1.5px solid rgba(46,125,107,0.3)", borderRadius:20, padding:"6px 13px", fontFamily:"Georgia,serif", fontSize:12, color:MIDGREY, background:"transparent", cursor:"pointer" }}>{t}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
