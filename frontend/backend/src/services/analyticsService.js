const mongoose = require("mongoose");
const Event = require("../models/Event");
const { getOwnedProjectOrThrow } = require("./projectService");

const FUNNEL_STEPS = ["signup", "login", "dashboard"];
const ACTIVE_WINDOW_MS = 24 * 60 * 60 * 1000; // last 24 hours

function toObjectId(id) {
  return new mongoose.Types.ObjectId(id);
}

async function getSummary(companyId, projectId) {
  await getOwnedProjectOrThrow(companyId, projectId);
  const projectObjectId = toObjectId(projectId);

  const totalEvents = await Event.countDocuments({ projectId: projectObjectId });

  const uniqueUsersResult = await Event.distinct("userId", { projectId: projectObjectId });
  const uniqueUsers = uniqueUsersResult.length;

  const since = new Date(Date.now() - ACTIVE_WINDOW_MS);
  const activeUsersResult = await Event.distinct("userId", {
    projectId: projectObjectId,
    timestamp: { $gte: since },
  });
  const activeUsers = activeUsersResult.length;

  return { totalEvents, uniqueUsers, activeUsers };
}

async function getEventBreakdown(companyId, projectId) {
  await getOwnedProjectOrThrow(companyId, projectId);
  const projectObjectId = toObjectId(projectId);

  const rows = await Event.aggregate([
    { $match: { projectId: projectObjectId } },
    { $group: { _id: "$eventName", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const breakdown = {};
  rows.forEach((row) => {
    breakdown[row._id] = row.count;
  });

  return breakdown;
}

/**
 * Simple, understandable funnel: for each step after the first, only
 * count a user if they also completed every earlier step in the funnel
 * (not necessarily in a specific order/session, just "did it happen at
 * all"). This is a lightweight approximation of chronological
 * progression - not a full sequential/session-based funnel - but it is
 * more meaningful than counting each step's users independently.
 */
async function getFunnel(companyId, projectId) {
  await getOwnedProjectOrThrow(companyId, projectId);
  const projectObjectId = toObjectId(projectId);

  // usersByStep[step] = Set of userIds who fired that event
  const usersByStep = {};

  for (const step of FUNNEL_STEPS) {
    const users = await Event.distinct("userId", {
      projectId: projectObjectId,
      eventName: step,
    });
    usersByStep[step] = new Set(users);
  }

  const funnel = {};
  let carryOverUsers = null;

  for (const step of FUNNEL_STEPS) {
    const stepUsers = usersByStep[step];

    if (carryOverUsers === null) {
      carryOverUsers = stepUsers;
    } else {
      carryOverUsers = new Set([...carryOverUsers].filter((userId) => stepUsers.has(userId)));
    }

    funnel[step] = carryOverUsers.size;
  }

  return funnel;
}

async function getActivity(companyId, projectId) {
  await getOwnedProjectOrThrow(companyId, projectId);
  const projectObjectId = toObjectId(projectId);

  const rows = await Event.aggregate([
    { $match: { projectId: projectObjectId } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return rows.map((row) => ({ date: row._id, count: row.count }));
}

module.exports = { getSummary, getEventBreakdown, getFunnel, getActivity };
