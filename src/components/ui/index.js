import { useState, useEffect } from "react";
import { TEAL, MIDGREY, LTGREY, WHITE } from "../../constants/colors";
import { css } from "../../constants/styles";
import { RootsIcon } from "../icons";

export function FieldInput({ label, type="text", value, onChange, placeholder, error, right }) {
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={css.label}>{label}</label>}
      <div style={{ position:"relative" }}>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          style={{ ...css.input, borderColor: error ? "#E57373" : "rgba(46,125,107,0.3)", paddingRight: right ? 48 : 16 }} />
        {right && <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)" }}>{right}</div>}
      </div>
      {error && <p style={{ fontFamily:"Georgia,serif", fontSize:11, color:"#E57373", margin:"5px 0 0" }}>{error}</p>}
    </div>
  );
}

export function GoldButton({ children, onClick, disabled, outline=false, small=false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:"100%", border: outline ? `1.5px solid ${TEAL}` : "none", borderRadius:13,
      padding: small ? "10px 16px" : "14px",
      background: outline ? "transparent" : disabled ? "#A8C5BC" : TEAL,
      color: outline ? TEAL : WHITE,
      fontFamily:"Georgia,serif", fontSize: small ? 13 : 14, fontWeight:600,
      cursor: disabled ? "default" : "pointer",
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
      boxShadow: !outline && !disabled ? "0 4px 14px rgba(46,125,107,0.35)" : "none",
      transition:"all 0.2s",
    }}>{children}</button>
  );
}

export function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ background:"#FFF0F0", border:"1px solid #F5C5C5", borderRadius:10, padding:"10px 14px", marginBottom:14 }}>
      <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:"#C05050", margin:0 }}>{msg}</p>
    </div>
  );
}

export function Spinner({ size=38 }) {
  const [deg, setDeg] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDeg(d => (d + 6) % 360), 16);
    return () => clearInterval(t);
  }, []);
  return <div style={{ display:"inline-block", transform:`rotate(${deg}deg)` }}><RootsIcon size={size} /></div>;
}

// Animated logo-tree loader.
// Phase 1: trunk sprouts up. Phase 2: canopy grows up from trunk. Phase 3: roots spread down.
// Holds full tree, then resets and repeats.
export function GrowingTree({ size=88 }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    // ms to hold at each step: 0=blank, 1=trunk, 2=canopy, 3=roots, 4=full hold
    const timings = [150, 480, 600, 520, 1050];
    const t = setTimeout(
      () => setStep(s => (s >= 4 ? 0 : s + 1)),
      timings[step] ?? 400
    );
    return () => clearTimeout(t);
  }, [step]);

  // No transition on reset (step 0) so the tree instantly vanishes before re-growing
  const tr = step === 0 ? "none" : "transform 0.45s cubic-bezier(0.34,1.2,0.64,1)";

  return (
    <svg width={size} height={size} viewBox="-30 0 160 130" fill={TEAL}>
      {/* Trunk — scaleY from bottom (grows upward) */}
      <g style={{ transform: step >= 1 ? "scaleY(1)" : "scaleY(0)", transformBox:"fill-box", transformOrigin:"center bottom", transition: tr }}>
        <rect x="45" y="58" width="10" height="16" rx="2"/>
      </g>

      {/* Canopy — scaleY from bottom of canopy group (grows upward from trunk top) */}
      <g style={{ transform: step >= 2 ? "scaleY(1)" : "scaleY(0)", transformBox:"fill-box", transformOrigin:"center bottom", transition: tr }}>
        <ellipse cx="50" cy="32" rx="46" ry="26"/>
        <circle cx="50" cy="8"  r="18"/>
        <circle cx="26" cy="14" r="17"/>
        <circle cx="74" cy="14" r="17"/>
        <circle cx="6"  cy="28" r="16"/>
        <circle cx="94" cy="28" r="16"/>
        <circle cx="10" cy="46" r="14"/>
        <circle cx="90" cy="46" r="14"/>
        <circle cx="26" cy="50" r="14"/>
        <circle cx="74" cy="50" r="14"/>
        <circle cx="50" cy="52" r="14"/>
      </g>

      {/* Roots — scaleY from top of roots group (spreads downward from trunk base) */}
      <g fill="none" stroke={TEAL} strokeLinecap="round"
        style={{ transform: step >= 3 ? "scaleY(1)" : "scaleY(0)", transformBox:"fill-box", transformOrigin:"center top", transition: tr }}>
        <path d="M50 74 C46 76 34 80 14 84"    strokeWidth="2.5"/>
        <path d="M50 74 C54 76 66 80 86 84"    strokeWidth="2.5"/>
        <path d="M50 74 C50 82 50 92 50 110"   strokeWidth="2.2"/>
        <path d="M48 76 C40 84 26 94 4 100"    strokeWidth="2"/>
        <path d="M52 76 C60 84 74 94 96 100"   strokeWidth="2"/>
        <path d="M47 77 C36 90 18 102 -4 112"  strokeWidth="1.8"/>
        <path d="M53 77 C64 90 82 102 104 112" strokeWidth="1.8"/>
        <path d="M49 79 C44 90 36 104 22 118"  strokeWidth="1.5"/>
        <path d="M51 79 C56 90 64 104 78 118"  strokeWidth="1.5"/>
        <path d="M48 81 C38 96 20 108 -2 122"  strokeWidth="1.3"/>
        <path d="M52 81 C62 96 80 108 102 122" strokeWidth="1.3"/>
        <path d="M50 84 C44 98 32 112 12 126"  strokeWidth="1.1"/>
        <path d="M50 84 C56 98 68 112 88 126"  strokeWidth="1.1"/>
        <path d="M49 75 C46 82 40 92 30 100"   strokeWidth="1.8"/>
        <path d="M51 75 C54 82 60 92 70 100"   strokeWidth="1.8"/>
        <path d="M48 78 C44 88 38 100 28 112"  strokeWidth="1.5"/>
        <path d="M52 78 C56 88 62 100 72 112"  strokeWidth="1.5"/>
        <path d="M49 80 C46 90 42 104 36 118"  strokeWidth="1.3"/>
        <path d="M51 80 C54 90 58 104 64 118"  strokeWidth="1.3"/>
        <path d="M50 76 C48 86 46 98 42 114"   strokeWidth="1.2"/>
        <path d="M50 76 C52 86 54 98 58 114"   strokeWidth="1.2"/>
      </g>
    </svg>
  );
}

export function LoadingState({ msg="Loading…" }) {
  return (
    <div style={{ textAlign:"center", padding:"40px 0" }}>
      <div style={{ display:"flex", justifyContent:"center" }}>
        <GrowingTree size={80} />
      </div>
      <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:MIDGREY, marginTop:10, fontStyle:"italic" }}>{msg}</p>
    </div>
  );
}

export function Divider({ text="OR" }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, margin:"16px 0" }}>
      <div style={{ flex:1, height:1, background:"rgba(46,125,107,0.2)" }}/>
      <span style={{ fontFamily:"Georgia,serif", fontSize:11, color:LTGREY, letterSpacing:"0.1em" }}>{text}</span>
      <div style={{ flex:1, height:1, background:"rgba(46,125,107,0.2)" }}/>
    </div>
  );
}
