const express = require("express");
const authGuard = require("../controllers/authGuard");
const validateAnalytics = require("../middleware/validateAnalytics");
const analyticsService = require("../services/analyticsService");

const router = express.Router();

router.get("/summary/:projectId", authGuard, validateAnalytics, async (req, res, next) => {
  try {
    const summary = await analyticsService.getSummary(req.user.companyId, req.params.projectId);
    res.status(200).json(summary);
  } catch (err) {
    next(err);
  }
});

router.get("/events/:projectId", authGuard, validateAnalytics, async (req, res, next) => {
  try {
    const breakdown = await analyticsService.getEventBreakdown(req.user.companyId, req.params.projectId);
    res.status(200).json(breakdown);
  } catch (err) {
    next(err);
  }
});

router.get("/funnel/:projectId", authGuard, validateAnalytics, async (req, res, next) => {
  try {
    const funnel = await analyticsService.getFunnel(req.user.companyId, req.params.projectId);
    res.status(200).json(funnel);
  } catch (err) {
    next(err);
  }
});

router.get("/activity/:projectId", authGuard, validateAnalytics, async (req, res, next) => {
  try {
    const activity = await analyticsService.getActivity(req.user.companyId, req.params.projectId);
    res.status(200).json(activity);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
