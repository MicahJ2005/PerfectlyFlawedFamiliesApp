import { CHARCOAL, TEAL, LTGREY, MIDGREY } from "../constants/colors";

const SECTIONS = [
  {
    icon: "⚖️",
    title: "Not Legal Advice",
    body:
      "The content provided by Perfectly Flawed Families — including devotions, family guidance, and any other materials within this app — is intended solely for faith-based encouragement and spiritual development. Nothing in this app constitutes legal advice of any kind.\n\nIf you have a legal matter or concern — including matters related to family law, divorce, custody, or guardianship — please consult a licensed attorney or qualified legal professional in your jurisdiction. Reliance on any content within this app for legal purposes is done entirely at your own risk.",
  },
  {
    icon: "🧠",
    title: "Not Professional Counseling",
    body:
      "Perfectly Flawed Families is not a licensed counseling service and does not provide mental health, psychological, marital, or professional therapeutic services. The devotions, family guidance, and prayer features in this app are spiritual in nature and are not a substitute for professional mental health or relationship care.\n\nIf you or a family member is experiencing a mental health crisis, domestic distress, or any condition requiring clinical support, we strongly encourage you to seek help from a licensed counselor, therapist, psychologist, or your primary care provider. In an emergency, please contact your local emergency services or a crisis helpline.\n\nNational Domestic Violence Hotline: 1-800-799-7233\nCrisis Text Line: Text HOME to 741741",
  },
  {
    icon: "🛡️",
    title: "Content Moderation & Community Standards",
    body:
      "Perfectly Flawed Families is built on a foundation of faith, grace, and Christ-centered values. We are committed to maintaining a community that reflects those values in every interaction.\n\nPerfectly Flawed Families reserves the right to remove, moderate, or restrict any user-submitted content — including prayer requests, group posts, or any other contributions — that does not align with our mission and values. This includes, but is not limited to, content that is hateful, abusive, discriminatory, sexually explicit, politically divisive, or otherwise contrary to the spirit of this community.\n\nBy using this app, you agree to submit content in good faith and in a manner consistent with our mission to encourage families through Scripture, prayer, and grace.",
  },
  {
    icon: "📋",
    title: "General Disclaimer",
    body:
      "Perfectly Flawed Families provides this app and its content \"as is\" without warranties of any kind. We make no guarantees regarding the completeness, accuracy, or suitability of any content for your specific family situation.\n\nThe guidance offered through this app — including devotions and family roots sessions — is grounded in Scripture and intended to supplement, not replace, your personal discernment, pastoral relationships, and professional advisors.\n\nFor questions about these terms or our community standards, please contact us at perfectlyflawedleadership@gmail.com.",
  },
];

export function DisclaimerScreen({ onBack }) {
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "0 20px 100px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "28px 0 8px" }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 26, color: CHARCOAL, padding: 0, lineHeight: 1, marginLeft: -4 }}
        >
          ‹
        </button>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: 22, fontWeight: 700, color: CHARCOAL, margin: 0 }}>
          Disclaimers & Policies
        </h1>
      </div>
      <p style={{ fontFamily: "Georgia,serif", fontSize: 13, color: MIDGREY, margin: "0 0 24px", lineHeight: 1.7 }}>
        Please read the following carefully. By using Perfectly Flawed Families, you acknowledge and agree to the terms below.
      </p>

      {SECTIONS.map((section) => (
        <div
          key={section.title}
          style={{
            background: "rgba(255,255,255,0.82)",
            borderRadius: 14,
            border: "1px solid rgba(46,125,107,0.18)",
            padding: "20px 18px",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>{section.icon}</span>
            <p style={{ fontFamily: "Georgia,serif", fontSize: 15, fontWeight: 700, color: CHARCOAL, margin: 0 }}>
              {section.title}
            </p>
          </div>
          <div style={{ height: 1, background: "rgba(46,125,107,0.15)", marginBottom: 14 }} />
          {section.body.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              style={{ fontFamily: "Georgia,serif", fontSize: 13, color: MIDGREY, lineHeight: 1.8, margin: i < section.body.split("\n\n").length - 1 ? "0 0 12px" : 0 }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      ))}

      <div style={{ marginTop: 16, padding: 18, background: "rgba(46,125,107,0.06)", borderRadius: 14, border: "1px solid rgba(46,125,107,0.15)", textAlign: "center" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: 12, color: LTGREY, lineHeight: 1.75, margin: "0 0 4px" }}>
          Questions about these policies?
        </p>
        <a
          href="mailto:perfectlyflawedleadership@gmail.com"
          style={{ fontFamily: "Georgia,serif", fontSize: 13, color: TEAL, fontWeight: 600, textDecoration: "none" }}
        >
          perfectlyflawedleadership@gmail.com
        </a>
      </div>

    </div>
  );
}
