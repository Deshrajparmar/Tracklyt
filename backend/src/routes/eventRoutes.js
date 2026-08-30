const express = require("express");
const authGuard = require("../controllers/authGuard");
const validateEvent = require("../middleware/validateEvent");
const validateAnalytics = require("../middleware/validateAnalytics");
const eventService = require("../services/eventService");

const router = express.Router();

router.post("/", authGuard, validateEvent, async (req, res, next) => {
  try {
    const { projectId, userId, eventName, page } = req.body;
    const event = await eventService.createEvent(req.user.companyId, {
      projectId,
      userId,
      eventName,
      page,
    });
    res.status(201).json({ message: "Event recorded", event });
  } catch (err) {
    next(err);
  }
});

router.get("/:projectId", authGuard, validateAnalytics, async (req, res, next) => {
  try {
    const events = await eventService.getEventsForProject(req.user.companyId, req.params.projectId);
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
