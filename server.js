require('dotenv').config();
const express = require("express");
const cors    = require("cors");

const app  = express();
const PORT = 3001;

const apiKey = process.env.ANTHROPIC_API_KEY;
console.log("Key loaded:", apiKey ? "Yes" : "No");

app.use(cors());
app.use(express.json());

async function callClaude(system, userMessage) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type":      "application/json",
      "x-api-key":         apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model:      "claude-sonnet-4-6",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Anthropic API error ${res.status}: ${errorData.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const text = data.content?.map((b) => b.text || "").join("") || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// POST /api/devotion
// Body: { topic: string }
app.post("/api/devotion", async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: "topic is required" });

  try {
    const result = await callClaude(
      `You are a devotional writer for Perfectly Flawed Families — a faith-based ministry serving imperfect families growing together in grace. Your devotions address the real struggles and seasons of family life: marriage, parenting, blended families, grief, finances, in-law relationships, and more. Tone: warm, honest, pastoral — speak to the heart of a parent, spouse, or family member who is weary but hopeful. Ground every devotion firmly in Scripture. Respond ONLY with valid JSON (no markdown, no backticks): {"title":"...","scripture":{"verse":"exact text","reference":"Book Ch:V"},"body":"3-4 paragraphs separated by \\n\\n","analogy":"a vivid, concrete real-world analogy (2-3 sentences) that illustrates the devotion's core truth — drawn from family life, farming, nature, or a relatable human experience. Must feel true-to-life, not generic.","reflection":"one penetrating question for personal or couples reflection","prayer":"2-3 sentence closing prayer for the family"}`,
      `Write a family devotion on the topic: ${topic}`
    );
    res.json(result);
  } catch (err) {
    console.error("Devotion error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/family-compass
// Body: { situation, details, role, experience }
app.post("/api/family-compass", async (req, res) => {
  const { situation, details, role, experience } = req.body;
  if (!details) return res.status(400).json({ error: "details is required" });

  try {
    const result = await callClaude(
      `You are a seasoned, faith-grounded family advisor for Perfectly Flawed Families. You speak with the warmth of a pastor and the practicality of a trusted mentor. Your advice is always rooted in Scripture, grace-filled, and honest about the difficulty of family life — never preachy or trite. Respond ONLY with valid JSON (no markdown, no backticks): {"headline":"bold truth 6-10 words","coretruth":"2-3 honest, grace-filled sentences","scriptures":[{"verse":"exact text","reference":"Book Ch:V","application":"1 sentence applying this to the family situation"},{"verse":"...","reference":"...","application":"..."},{"verse":"...","reference":"...","application":"..."}],"framework":{"name":"framework name","insight":"2 sentences applying a proven family or relational principle to this specific situation"},"actions":["concrete verb-led action step 1","action step 2","action step 3","action step 4"],"caution":"one honest warning about a common pitfall or blind spot families face in this situation","prayer_focus":"1-sentence prayer prompt for this family"}`,
      `Family situation: ${situation?.label}\nDetails: ${details}\nFamily role: ${role || "Not specified"}\nFamily experience level: ${experience || "Not specified"}`
    );
    res.json(result);
  } catch (err) {
    console.error("Family Roots error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Perfectly Flawed Families backend running on http://localhost:${PORT}`);
});
