import { useState } from "react";
import { CHARCOAL, TEAL, LTGREY, MIDGREY } from "../constants/colors";

const FEATURES = [
  {
    icon: "📖",
    title: "Family Devotions",
    tab: "Devotion tab",
    description:
      "Enter any family topic or theme and receive a personalized, Scripture-rooted devotion — including a key verse, 3-4 paragraphs of reflection, a closing question, and a prayer. Devotions are tailored to the seasons and struggles of family life. Tap Save to add any devotion to your personal family library.",
    tips: [
      'Try topics like "patience as a parent", "conflict in marriage", or "blended family challenges"',
      'Tap "Saved Devotions" on your Profile to revisit past ones',
      "Share a devotion with your spouse or family by using the Share button",
    ],
  },
  {
    icon: "🧭",
    title: "Family Roots",
    tab: "Roots tab",
    description:
      "Describe a real family situation you're facing — from marriage friction to parenting struggles to in-law tension — and receive faith-grounded, practical guidance. Family Roots surfaces a bold core truth, three Scripture passages with direct application, a family wisdom framework, concrete action steps, an honest caution, and a prayer focus — all tailored to your situation and family role.",
    tips: [
      "Be specific: the more detail you give, the sharper the guidance",
      "Select your family role and experience level for results tailored to your season",
      "Past sessions are saved and viewable in your Profile stats",
    ],
  },
  {
    icon: "🙏",
    title: "Family Prayer Wall",
    tab: "Prayer tab",
    description:
      "Post prayer requests to the community Family Prayer Wall or pray for others. You can post anonymously or with your name. Tap the prayer hands icon on any request to mark that you've prayed for it — the count is visible to the community as an encouragement.",
    tips: [
      'Toggle "Post anonymously" to share without showing your name',
      'Tap "I prayed" on any request to register your prayer for that family',
      "Enable push notifications (Profile > Notifications) to be alerted when new requests are posted",
    ],
  },
  {
    icon: "🔒",
    title: "Private Family Groups",
    tab: "Prayer tab > Private Groups",
    description:
      "Create a private group for your family, small group, or close friends and share a unique join code with them. Only group members can see and respond to prayer requests posted inside the group — perfect for sharing vulnerably with people who truly know your family.",
    tips: [
      'Tap "Create Group" to generate a shareable code instantly',
      'Share the code with family members — they tap "Join with Code" and enter it',
      "You can belong to multiple private groups at once",
    ],
  },
  {
    icon: "👥",
    title: "Public Prayer Groups",
    tab: "Profile > My Prayer Groups",
    description:
      'Join community-wide prayer groups organized around family seasons and topics (e.g. "Couples Circle", "Single Parents", "Blended Families"). Your membership filters the Prayer Wall so you can focus on families in similar seasons.',
    tips: [
      "Join as many groups as you like",
      "Groups appear as filter tabs in your Prayer Wall",
    ],
  },
  {
    icon: "💳",
    title: "Membership",
    tab: "Paywall / Profile > Membership",
    description:
      'Family Devotions and Family Roots require a membership. Choose a monthly or annual plan. If you received an access code, tap "Have an access code?" on the paywall screen to redeem it. Active members can manage or cancel their subscription anytime from Profile > Membership > Manage.',
    tips: [
      "Annual plans save 40% compared to monthly",
      "Access codes grant full membership",
      "Cancellations take effect at the end of your current billing period",
    ],
  },
  {
    icon: "🌙",
    title: "Dark Mode",
    tab: "Profile > App Settings & Help",
    description:
      "Toggle dark mode to reduce eye strain in low-light environments. The setting is saved automatically and applies instantly across the entire app.",
    tips: [],
  },
  {
    icon: "🔔",
    title: "Push Notifications",
    tab: "Profile > Notifications",
    description:
      "Opt in to receive a push notification whenever a new prayer request is posted to the community wall. You can enable or disable this at any time from your Profile.",
    tips: [
      "You'll be prompted to allow notifications the first time you enable this",
      "If you accidentally blocked notifications, re-enable them in your browser or device settings",
    ],
  },
];

function FeatureCard({ feature, isOpen, onToggle }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.82)",
        borderRadius: 14,
        border: `1px solid ${isOpen ? "rgba(46,125,107,0.35)" : "rgba(46,125,107,0.18)"}`,
        marginBottom: 10,
        overflow: "hidden",
      }}
    >
      <div
        onClick={onToggle}
        style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", cursor: "pointer" }}
      >
        <span style={{ fontSize: 22 }}>{feature.icon}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: 14, fontWeight: 600, color: CHARCOAL, margin: "0 0 2px" }}>
            {feature.title}
          </p>
          <p style={{ fontFamily: "Georgia,serif", fontSize: 11, color: LTGREY, margin: 0 }}>{feature.tab}</p>
        </div>
        <span style={{ color: TEAL, fontSize: 18, display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>›</span>
      </div>

      {isOpen && (
        <div style={{ padding: "0 18px 18px" }}>
          <div style={{ height: 1, background: "rgba(46,125,107,0.15)", marginBottom: 14 }} />
          <p style={{ fontFamily: "Georgia,serif", fontSize: 13, color: CHARCOAL, lineHeight: 1.75, margin: "0 0 12px" }}>
            {feature.description}
          </p>
          {feature.tips.length > 0 && (
            <>
              <p style={{ fontFamily: "Georgia,serif", fontSize: 11, fontWeight: 600, color: TEAL, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px" }}>
                Tips
              </p>
              {feature.tips.map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                  <span style={{ color: TEAL, fontSize: 12, marginTop: 1, flexShrink: 0 }}>•</span>
                  <p style={{ fontFamily: "Georgia,serif", fontSize: 12, color: MIDGREY, lineHeight: 1.65, margin: 0 }}>{tip}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function HelpScreen({ onBack }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(prev => (prev === i ? null : i));

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "0 20px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "28px 0 8px" }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 26, color: CHARCOAL, padding: 0, lineHeight: 1, marginLeft: -4 }}
        >
          ‹
        </button>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: 22, fontWeight: 700, color: CHARCOAL, margin: 0 }}>
          How to Use This App
        </h1>
      </div>
      <p style={{ fontFamily: "Georgia,serif", fontSize: 13, color: MIDGREY, margin: "0 0 24px", lineHeight: 1.7 }}>
        Perfectly Flawed Families is a faith-based tool for imperfect families growing together in grace. Tap any feature below to learn more.
      </p>

      {FEATURES.map((f, i) => (
        <FeatureCard
          key={f.title}
          feature={f}
          isOpen={openIndex === i}
          onToggle={() => toggle(i)}
        />
      ))}

      <div style={{ marginTop: 24, padding: "18px", background: "rgba(46,125,107,0.06)", borderRadius: 14, border: "1px solid rgba(46,125,107,0.15)", textAlign: "center" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: 13, color: MIDGREY, lineHeight: 1.75, margin: 0 }}>
          Still have questions? Reach us at{" "}
          <a
            href="mailto:support@perfectlyflawed.com"
            style={{ color: TEAL, textDecoration: "none", fontWeight: 600 }}
          >
            support@perfectlyflawed.com
          </a>
        </p>
      </div>
    </div>
  );
}
