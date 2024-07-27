const express = require("express");
const {
  invertoryController,
  getInventory,
  getDonarsController,
  getHospitalsController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getHospitalInventory,
  getRecentInventoryController,
} = require("../controllers/invetoryController");
const authMiddleware = require("../middlewares/authMiddleware");

//invertory route
const router = express.Router();
//post request
router.post("/create-inventory", authMiddleware, invertoryController);

//get inventory
router.get("/get-inventory", authMiddleware, getInventory);

//get recent 3 inventory
router.get(
  "/get-recent-inventory",
  authMiddleware,
  getRecentInventoryController
);

// get all blood allBloodRecords
// router.get("/get-blood-inventory", authMiddleware, getAllBloodRecords);

//get hospital inventory
router.post("/get-hospital-inventory", authMiddleware, getHospitalInventory);

//get doanrs
router.get("/get-donars", authMiddleware, getDonarsController);

//get hospital details
router.get("/get-hospitals", authMiddleware, getHospitalsController);

//get organisation  details
router.get("/get-organisation", authMiddleware, getOrganisationController);

//get organisation  details for hospital
router.get(
  "/get-organisation-for-hospital",
  authMiddleware,
  getOrganisationForHospitalController
);

module.exports = router;
