/**
 * DEV-ONLY helper: sends a batch of realistic demo events through the
 * real POST /events API for a given project, so the analytics
 * dashboard has something to show. This does NOT write to MongoDB
 * directly - it exercises the same code path a real integration would.
 *
 * Usage:
 *   API_URL=http://localhost:8080 TOKEN=<jwt> PROJECT_ID=<id> node src/scripts/seedDemoEvents.js
 */

const API_URL = process.env.API_URL || "http://localhost:8080";
const TOKEN = process.env.TOKEN;
const PROJECT_ID = process.env.PROJECT_ID;

if (!TOKEN || !PROJECT_ID) {
  console.error("Usage: TOKEN=<jwt> PROJECT_ID=<id> node src/scripts/seedDemoEvents.js");
  process.exit(1);
}

const EVENT_NAMES = ["signup", "login", "page_view", "button_click", "purchase", "dashboard", "logout"];
const PAGES = ["/signup", "/login", "/home", "/pricing", "/checkout", "/dashboard"];
const USER_COUNT = 25;
const EVENTS_PER_RUN = 120;

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function sendEvent(userId, eventName, page) {
  const res = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ projectId: PROJECT_ID, userId, eventName, page }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Failed to create event: ${res.status} ${body.message || ""}`);
  }
}

async function main() {
  console.log(`Sending ${EVENTS_PER_RUN} demo events to project ${PROJECT_ID}...`);

  for (let i = 0; i < EVENTS_PER_RUN; i++) {
    const userId = `user_${String((i % USER_COUNT) + 1).padStart(3, "0")}`;
    const eventName = randomFrom(EVENT_NAMES);
    const page = randomFrom(PAGES);

    await sendEvent(userId, eventName, page);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
