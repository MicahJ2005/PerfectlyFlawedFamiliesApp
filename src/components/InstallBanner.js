import { useState, useEffect } from "react";
import { TEAL, WHITE, CHARCOAL, MIDGREY, LTGREY } from "../constants/colors";
import { RootsIcon } from "./icons";

const STORAGE_KEY = "pff-install-dismissed";

function detectEnv() {
  const ua         = navigator.userAgent;
  const ios        = /iphone|ipad|ipod/i.test(ua);
  const safari     = /safari/i.test(ua) && !/chrome/i.test(ua) && !/crios/i.test(ua);
  const android    = /android/i.test(ua);
  const mobile     = ios || android;
  const standalone = window.navigator.standalone ||
                     window.matchMedia("(display-mode: standalone)").matches;
  return { ios, safari, android, mobile, standalone };
}

export function InstallBanner({ installPrompt, triggerInstall, isInstalled }) {
  const [visible, setVisible] = useState(false);
  const [env,     setEnv]     = useState(null);

  useEffect(() => {
    if (isInstalled)                       return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const e = detectEnv();
    if (e.standalone) return;

    setEnv(e);
    setVisible(true);
  }, [isInstalled]);

  // If Chrome fires the prompt after mount, no re-render needed — triggerInstall uses it
  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const install = async () => {
    if (installPrompt) await triggerInstall();
    dismiss();
  };

  if (!visible || !env) return null;

  const isIosSafari = env.ios && env.safari;
  const canNativeInstall = !!installPrompt;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 300,
      background: "rgba(45,43,40,0.65)",
      display: "flex", alignItems: "flex-end",
    }}>
      <div style={{
        width: "100%", background: "#FDFAF5",
        borderRadius: "24px 24px 0 0",
        padding: "32px 24px 44px",
        boxSizing: "border-box",
        boxShadow: "0 -8px 40px rgba(45,43,40,0.25)",
      }}>

        {/* Icon + title */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18,
            background: "linear-gradient(135deg,#2E7D6B,#3A9E88)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 6px 20px rgba(46,125,107,0.4)",
          }}>
            <RootsIcon size={40} color={WHITE} />
          </div>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:CHARCOAL, margin:"0 0 8px" }}>
            Perfectly Flawed Families
          </h2>
          <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:MIDGREY, margin:0, lineHeight:1.6 }}>
            Add to your home screen for the full app experience — works offline, no browser bar.
          </p>
        </div>

        {/* iOS Safari — Share sheet instructions */}
        {isIosSafari && (
          <div style={{ background:"rgba(46,125,107,0.08)", border:"1px solid rgba(46,125,107,0.2)", borderRadius:14, padding:"16px 18px", marginBottom:20 }}>
            <p style={{ fontFamily:"Georgia,serif", fontSize:13, fontWeight:600, color:CHARCOAL, margin:"0 0 12px" }}>
              Install on iPhone / iPad:
            </p>
            <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:10 }}>
              <span style={{ fontSize:20, flexShrink:0 }}>1️⃣</span>
              <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:MIDGREY, margin:0, lineHeight:1.6 }}>
                Tap the <strong style={{ color:TEAL }}>Share</strong> button <span style={{ fontSize:15 }}>⎋</span> at the bottom of Safari
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
              <span style={{ fontSize:20, flexShrink:0 }}>2️⃣</span>
              <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:MIDGREY, margin:0, lineHeight:1.6 }}>
                Scroll down and tap <strong style={{ color:TEAL }}>"Add to Home Screen"</strong>
              </p>
            </div>
          </div>
        )}

        {/* Chrome / Android with native prompt available */}
        {!isIosSafari && canNativeInstall && (
          <button onClick={install} style={{
            width: "100%", marginBottom: 12,
            background: `linear-gradient(135deg,${TEAL},#3A9E88)`,
            border: "none", borderRadius: 14, padding: 16,
            fontFamily: "Georgia,serif", fontSize: 15, fontWeight: 700, color: WHITE,
            cursor: "pointer", boxShadow: "0 6px 18px rgba(46,125,107,0.4)",
          }}>
            Add to Home Screen
          </button>
        )}

        {/* Chrome / Android — no native prompt yet, show manual instructions */}
        {!isIosSafari && !canNativeInstall && (
          <div style={{ background:"rgba(46,125,107,0.08)", border:"1px solid rgba(46,125,107,0.2)", borderRadius:14, padding:"16px 18px", marginBottom:20 }}>
            <p style={{ fontFamily:"Georgia,serif", fontSize:13, fontWeight:600, color:CHARCOAL, margin:"0 0 12px" }}>
              {env.mobile ? "Install on Android:" : "Install on desktop:"}
            </p>
            {env.mobile ? (
              <>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:10 }}>
                  <span style={{ fontSize:20, flexShrink:0 }}>1️⃣</span>
                  <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:MIDGREY, margin:0, lineHeight:1.6 }}>
                    Tap the <strong style={{ color:TEAL }}>⋮ menu</strong> in Chrome
                  </p>
                </div>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <span style={{ fontSize:20, flexShrink:0 }}>2️⃣</span>
                  <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:MIDGREY, margin:0, lineHeight:1.6 }}>
                    Tap <strong style={{ color:TEAL }}>"Add to Home Screen"</strong>
                  </p>
                </div>
              </>
            ) : (
              <p style={{ fontFamily:"Georgia,serif", fontSize:13, color:MIDGREY, margin:0, lineHeight:1.6 }}>
                Look for the <strong style={{ color:TEAL }}>install icon ⊕</strong> in your browser's address bar, then click <strong style={{ color:TEAL }}>"Install"</strong>.
              </p>
            )}
          </div>
        )}

        <button onClick={dismiss} style={{
          width: "100%", background: "transparent",
          border: "none", padding: 12,
          fontFamily: "Georgia,serif", fontSize: 13, color: LTGREY,
          cursor: "pointer",
        }}>
          Continue in browser
        </button>
      </div>
    </div>
  );
}
