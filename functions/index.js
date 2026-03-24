const { setGlobalOptions }    = require("firebase-functions/v2");
const { onRequest }           = require("firebase-functions/v2/https");
const { onDocumentCreated }   = require("firebase-functions/v2/firestore");
const { onSchedule }          = require("firebase-functions/v2/scheduler");
const admin                   = require("firebase-admin");
const { Timestamp, FieldPath } = require("firebase-admin/firestore");

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({ maxInstances: 10, region: "us-central1" });

// ─── Shared helpers ──────────────────────────────────────────────────────────

/** Apply CORS headers and short-circuit preflight requests. Returns true if preflight. */
function applyCors(req, res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") { res.status(204).send(""); return true; }
  return false;
}

/** Call the Anthropic Claude API and return parsed JSON from the response. */
async function callClaude(system, userMessage) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type":      "application/json",
      "x-api-key":         process.env.ANTHROPIC_API_KEY,
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
    const err = await res.json();
    throw new Error(`Anthropic API error ${res.status}: ${err.error?.message || res.statusText}`);
  }
  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

/** Return a configured Stripe instance. */
function stripe() {
  return require("stripe")(process.env.STRIPE_SECRET_KEY);
}

/** Return a configured web-push instance. */
function webpush() {
  const wp = require("web-push");
  wp.setVapidDetails(
    "mailto:support@perfectlyflawedfamilies.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
  return wp;
}

// ─── 1. Generate Family Devotion ─────────────────────────────────────────────
// Replaces POST /api/devotion from server.js

exports.devotion = onRequest(async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { topic, ageRanges = [], perspective = "parent", childInterest = null } = req.body;
  if (!topic) return res.status(400).json({ error: "topic is required" });

  const interestContext = childInterest
    ? `Weave a vivid, natural connection to "${childInterest}" into the body or analogy — use it as a concrete illustration the child would recognize and find exciting. Let it illuminate the spiritual truth without forcing it.`
    : "";

  const ageContext = ageRanges.length
    ? `The family includes children in these age groups: ${ageRanges.join(", ")}. Tailor vocabulary, illustrations, and the reflection question to be accessible and meaningful for these ages. If toddlers/little ones are present, use simple concrete language and playful imagery. If elementary-age children are present, include a short activity or object lesson idea within the body. If teenagers are present, speak honestly to their doubts and identity questions. If adults only, write for mature reflection without child-facing content.`
    : "Write for a general family audience.";

  const perspectiveContext = {
    parent:   "Write FROM a parent's perspective and TO the parent — guiding them in their role, their heart posture, and their faith as a caregiver. The parent is the reader.",
    child:    "Write this devotion TO nurture the child directly. Use warm, encouraging second-person language ('You are loved', 'God made you'). Speak to the child's heart, fears, identity, and worth. The parent may read it aloud to their child or the child may read it themselves. Keep language accessible, tender, and age-appropriate based on the age ranges provided. The reflection question should be for the child to answer.",
    together: "Write this devotion for the whole family to read together out loud. Use inclusive 'we' and 'our family' language. Include one moment in the body where a parent and child can interact (e.g. a question to ask each other, something to do together). The reflection question should be one the whole family answers together.",
    couple:   "Write this devotion specifically for a husband and wife to read together. Speak to the intimacy, tension, and beauty of marriage. Use 'you two', 'your marriage', 'together'. The reflection question should be for the couple to discuss with each other.",
  }[perspective] || "";

  try {
    const result = await callClaude(
      `You are a devotional writer for Perfectly Flawed Families — a faith-based ministry serving imperfect families growing together in grace. Your devotions address the real struggles and seasons of family life: marriage, parenting, blended families, grief, finances, in-law relationships, and more. Tone: warm, honest, pastoral — speak to the heart of a parent, spouse, or family member who is weary but hopeful. Ground every devotion firmly in Scripture. ${ageContext} ${perspectiveContext} ${interestContext} Respond ONLY with valid JSON (no markdown, no backticks): {"title":"...","scripture":{"verse":"exact text","reference":"Book Ch:V"},"body":"3-4 paragraphs separated by \\n\\n","analogy":"a vivid, concrete real-world analogy (2-3 sentences) that illustrates the devotion's core truth — drawn from family life, farming, nature, or a relatable human experience. Must feel true-to-life, not generic.","reflection":"one penetrating question for personal or couples reflection","prayer":"2-3 sentence closing prayer for the family"}`,
      `Write a family devotion on the topic: ${topic}`,
    );
    res.json(result);
  } catch (err) {
    console.error("Devotion error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── 2. Generate Family Roots Guidance ───────────────────────────────────────
// Replaces POST /api/family-compass from server.js

exports.familyCompass = onRequest(async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { situation, details, role, experience } = req.body;
  if (!details) return res.status(400).json({ error: "details is required" });

  try {
    const result = await callClaude(
      `You are a seasoned, faith-grounded family advisor for Perfectly Flawed Families. You speak with the warmth of a pastor and the practicality of a trusted mentor. Your advice is always rooted in Scripture, grace-filled, and honest about the difficulty of family life — never preachy or trite. Respond ONLY with valid JSON (no markdown, no backticks): {"headline":"bold truth 6-10 words","coretruth":"2-3 honest, grace-filled sentences","scriptures":[{"verse":"exact text","reference":"Book Ch:V","application":"1 sentence applying this to the family situation"},{"verse":"...","reference":"...","application":"..."},{"verse":"...","reference":"...","application":"..."}],"framework":{"name":"framework name","insight":"2 sentences applying a proven family or relational principle to this specific situation"},"actions":["concrete verb-led action step 1","action step 2","action step 3","action step 4"],"caution":"one honest warning about a common pitfall or blind spot families face in this situation","prayer_focus":"1-sentence prayer prompt for this family"}`,
      `Family situation: ${situation?.label}\nDetails: ${details}\nFamily role: ${role || "Not specified"}\nFamily experience level: ${experience || "Not specified"}`,
    );
    res.json(result);
  } catch (err) {
    console.error("Family Roots error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── 3. Create Stripe Checkout Session ───────────────────────────────────────
// POST /api/create-checkout-session  { priceId, uid, email }

exports.createCheckoutSession = onRequest(async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { priceId, uid, email } = req.body;
  if (!priceId || !uid || !email) {
    return res.status(400).json({ error: "priceId, uid, and email are required" });
  }

  try {
    const s = stripe();
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    let customerId = userDoc.data()?.stripeCustomerId;

    if (!customerId) {
      const customer = await s.customers.create({ email, metadata: { firebaseUid: uid } });
      customerId = customer.id;
      await userRef.set({ stripeCustomerId: customerId }, { merge: true });
    }

    const session = await s.checkout.sessions.create({
      customer:             customerId,
      payment_method_types: ["card"],
      line_items:           [{ price: priceId, quantity: 1 }],
      mode:                 "subscription",
      success_url:          `${process.env.APP_URL}/?payment=success`,
      cancel_url:           `${process.env.APP_URL}/?payment=cancelled`,
      metadata:             { firebaseUid: uid },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── 4. Create Stripe Billing Portal Session ──────────────────────────────────
// POST /api/create-portal-session  { uid }

exports.createPortalSession = onRequest(async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: "uid is required" });

  try {
    const userDoc = await db.collection("users").doc(uid).get();
    const customerId = userDoc.data()?.stripeCustomerId;
    if (!customerId) return res.status(404).json({ error: "No subscription found for this user" });

    const session = await stripe().billingPortal.sessions.create({
      customer:   customerId,
      return_url: `${process.env.APP_URL}/`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Portal session error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── 5. Redeem Access Code ────────────────────────────────────────────────────
// POST /api/redeem-code  { code, uid }
// Codes live in /accessCodes/{CODE} with fields: active (bool), maxUses (int, optional)

exports.redeemCode = onRequest(async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { code, uid } = req.body;
  if (!code || !uid) return res.status(400).json({ error: "code and uid are required" });

  const normalized = code.trim().toUpperCase();
  const codeRef    = db.collection("accessCodes").doc(normalized);

  try {
    const granted = await db.runTransaction(async (tx) => {
      const codeDoc = await tx.get(codeRef);
      if (!codeDoc.exists)          throw Object.assign(new Error("Invalid access code"), { status: 404 });
      if (!codeDoc.data().active)   throw Object.assign(new Error("This code has already been used"), { status: 400 });

      tx.update(codeRef, {
        active:  false,
        usedBy:  uid,
        usedAt:  Timestamp.now(),
      });
      tx.set(db.collection("users").doc(uid), {
        subscribed:          true,
        subscriptionStatus:  "promo",
        promoCodeUsed:       normalized,
        promoGrantedAt:      Timestamp.now(),
      }, { merge: true });

      return true;
    });

    if (granted) res.json({ success: true, message: "Access granted!" });
  } catch (err) {
    const status = err.status || 500;
    console.error("Redeem code error:", err.message);
    res.status(status).json({ error: err.message });
  }
});

// ─── 6. Stripe Webhook ────────────────────────────────────────────────────────
// POST /api/stripe-webhook  — called directly by Stripe (no CORS needed)
// Handles: checkout.session.completed, subscription updated/deleted, payment_failed

exports.stripeWebhook = onRequest(async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe().webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  /** Find a user document by their Stripe customer ID. */
  async function userByCustomer(customerId) {
    const snap = await db.collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();
    return snap.empty ? null : snap.docs[0].ref;
  }

  try {
    const obj = event.data.object;

    switch (event.type) {

      case "checkout.session.completed": {
        const uid = obj.metadata?.firebaseUid;
        if (uid) {
          await db.collection("users").doc(uid).set({
            subscribed:           true,
            subscriptionStatus:   "active",
            stripeSubscriptionId: obj.subscription,
            subscribedAt:         Timestamp.now(),
          }, { merge: true });
        }
        break;
      }

      case "customer.subscription.updated": {
        const ref = await userByCustomer(obj.customer);
        if (ref) {
          const isActive = ["active", "trialing"].includes(obj.status);
          await ref.set({
            subscribed:           isActive,
            subscriptionStatus:   isActive ? "active" : obj.status,
            stripeSubscriptionId: obj.id,
          }, { merge: true });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const ref = await userByCustomer(obj.customer);
        if (ref) {
          await ref.set({
            subscribed:           false,
            subscriptionStatus:   "cancelled",
            stripeSubscriptionId: null,
          }, { merge: true });
        }
        break;
      }

      case "invoice.payment_failed": {
        const ref = await userByCustomer(obj.customer);
        if (ref) {
          await ref.set({ subscriptionStatus: "past_due" }, { merge: true });
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── 7. Push Notification: New Public Prayer ──────────────────────────────────
// Fires when a document is created in /prayerRequests/{prayerId}
// Notifies all subscribed users except the poster

exports.onNewPublicPrayer = onDocumentCreated("prayerRequests/{prayerId}", async (event) => {
  const prayer = event.data?.data();
  console.log("[PublicPrayer] triggered, uid:", prayer?.uid, "active:", prayer?.active);
  if (prayer?.active === false) return;

  const subsSnap = await db.collection("pushSubscriptions").get();
  console.log("[PublicPrayer] total subscriptions:", subsSnap.size);
  if (subsSnap.empty) return;

  const targets = subsSnap.docs.filter(doc => doc.id !== prayer.uid);
  console.log("[PublicPrayer] targets after filtering poster:", targets.length);

  const wp = webpush();
  const payload = JSON.stringify({
    title: "New Prayer Request",
    body:  prayer.isAnon
      ? "Someone shared an anonymous prayer request"
      : `${prayer.author} shared a prayer request`,
    icon:  "/icons/icon-192.png",
    badge: "/icons/icon-96.png",
    url:   "/",
  });

  const results = await Promise.allSettled(
    targets.map(async (doc) => {
      try {
        await wp.sendNotification(doc.data().subscription, payload);
        console.log("[PublicPrayer] sent to:", doc.id);
      } catch (err) {
        console.error("[PublicPrayer] send failed for", doc.id, "status:", err.statusCode, err.message);
        if (err.statusCode === 404 || err.statusCode === 410) await doc.ref.delete();
      }
    }),
  );
  console.log("[PublicPrayer] done, results:", results.length);
});

// ─── 8. Push Notification: New Private Group Prayer ───────────────────────────
// Fires when a document is created in /privateGroups/{groupId}/prayers/{prayerId}
// Notifies only members of that group

exports.onNewPrivateGroupPrayer = onDocumentCreated(
  "privateGroups/{groupId}/prayers/{prayerId}",
  async (event) => {
    const prayer = event.data?.data();
    const { groupId } = event.params;
    console.log("[PrivatePrayer] triggered, groupId:", groupId, "uid:", prayer?.uid, "active:", prayer?.active);
    if (prayer?.active === false) return;

    const groupDoc = await db.collection("privateGroups").doc(groupId).get();
    if (!groupDoc.exists) { console.log("[PrivatePrayer] group not found"); return; }

    const { members = [], name: groupName } = groupDoc.data();
    console.log("[PrivatePrayer] group:", groupName, "members:", members.length);
    if (members.length === 0) return;

    // Firestore `in` queries are capped at 30 items — batch if needed
    const BATCH = 30;
    const subscriptionDocs = [];
    for (let i = 0; i < members.length; i += BATCH) {
      const chunk = members.slice(i, i + BATCH);
      const snap = await db.collection("pushSubscriptions")
        .where(FieldPath.documentId(), "in", chunk)
        .get();
      subscriptionDocs.push(...snap.docs);
    }

    console.log("[PrivatePrayer] subscriptions found:", subscriptionDocs.length);
    if (subscriptionDocs.length === 0) return;

    const wp = webpush();
    const payload = JSON.stringify({
      title: `New prayer in ${groupName}`,
      body:  prayer.isAnon
        ? "Someone shared an anonymous prayer request"
        : `${prayer.author} shared a prayer request`,
      icon:  "/icons/icon-192.png",
      badge: "/icons/icon-96.png",
      url:   "/",
    });

    const targets = subscriptionDocs.filter(doc => doc.id !== prayer.uid);
    console.log("[PrivatePrayer] targets after filtering poster:", targets.length);

    const results = await Promise.allSettled(
      targets.map(async (doc) => {
        try {
          await wp.sendNotification(doc.data().subscription, payload);
          console.log("[PrivatePrayer] sent to:", doc.id);
        } catch (err) {
          console.error("[PrivatePrayer] send failed for", doc.id, "status:", err.statusCode, err.message);
          if (err.statusCode === 404 || err.statusCode === 410) await doc.ref.delete();
        }
      }),
    );
    console.log("[PrivatePrayer] done, results:", results.length);
  },
);

// ─── 9. Scheduled: Clean Up Expired Anonymous Prayers ─────────────────────────
// Runs daily at midnight UTC
// Deletes anonymous prayers (public + private) older than 10 days

exports.cleanupExpiredPrayers = onSchedule("0 0 * * *", async () => {
  const cutoff = Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000));

  // Public prayer wall
  const publicSnap = await db.collection("prayerRequests")
    .where("isAnon", "==", true)
    .where("createdAt", "<", cutoff)
    .get();

  // Private group prayers — iterate all groups
  const groupsSnap  = await db.collection("privateGroups").get();
  const privateDocs = [];
  await Promise.all(
    groupsSnap.docs.map(async (groupDoc) => {
      const snap = await groupDoc.ref.collection("prayers")
        .where("isAnon", "==", true)
        .where("createdAt", "<", cutoff)
        .get();
      privateDocs.push(...snap.docs);
    }),
  );

  const allDeletes = [...publicSnap.docs, ...privateDocs].map(doc => doc.ref.delete());
  await Promise.allSettled(allDeletes);

  console.log(
    `Cleanup complete: ${publicSnap.size} public + ${privateDocs.length} private anonymous prayers deleted`,
  );
});
