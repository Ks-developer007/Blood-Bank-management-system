const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  BloodGroupDetailsControlles,
} = require("../controllers/AnalyticsControllers");

//invertory route
const router = express.Router();

router.get("/get-analytics", authMiddleware, BloodGroupDetailsControlles);

module.exports = router;
