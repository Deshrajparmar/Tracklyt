import { useState } from "react";
import { eventsApi } from "../api/tracklytApi";
import { getErrorMessage } from "../api/client";
import Button from "./Button";

const EVENT_NAMES = ["signup", "login", "page_view", "button_click", "purchase", "dashboard", "logout"];
const PAGES = ["/signup", "/login", "/home", "/pricing", "/checkout", "/dashboard"];
const USER_COUNT = 20;
const EVENTS_TO_GENERATE = 60;

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * DEV/DEMO ONLY: sends a batch of realistic-looking events through the
 * real POST /events API so a new project has data to visualize. This
 * never writes fake numbers directly into the charts - every event
 * still goes through the same backend + database path as a real
 * integration would.
 */
export default function DemoEventsButton({ projectId, onGenerated }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");

    try {
      for (let i = 0; i < EVENTS_TO_GENERATE; i++) {
        const userId = `user_${String((i % USER_COUNT) + 1).padStart(3, "0")}`;
        await eventsApi.create({
          projectId,
          userId,
          eventName: randomFrom(EVENT_NAMES),
          page: randomFrom(PAGES),
        });
      }
      onGenerated();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to generate demo events."));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="secondary" onClick={handleGenerate} disabled={generating}>
        {generating ? "Generating..." : "Generate Demo Events"}
      </Button>
      <p className="text-xs text-gray-400">Dev tool — sends real test events via the API</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
