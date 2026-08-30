const Event = require("../models/Event");
const { getOwnedProjectOrThrow } = require("./projectService");

const MAX_EVENTS_RETURNED = 100;

async function createEvent(companyId, { projectId, userId, eventName, page }) {
  // Ownership check: this also guarantees a company can't write events
  // into a project it doesn't own.
  await getOwnedProjectOrThrow(companyId, projectId);

  const event = await Event.create({
    companyId,
    projectId,
    userId: String(userId).trim(),
    eventName: String(eventName).trim(),
    page: page ? String(page).trim() : "",
    timestamp: new Date(),
  });

  return event;
}

async function getEventsForProject(companyId, projectId) {
  await getOwnedProjectOrThrow(companyId, projectId);

  const events = await Event.find({ projectId })
    .sort({ timestamp: -1 })
    .limit(MAX_EVENTS_RETURNED)
    .select("userId eventName page timestamp -_id");

  return events;
}

module.exports = { createEvent, getEventsForProject };
