const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const AdminMiddleware = require("../middlewares/AdminMiddleware");
const {
  getDonarListController,
  getHospitalListController,
  getOrgListController,
  deleteListController,
} = require("../controllers/AdminControllers");

const router = express.Router();

router.get(
  "/donar-list",
  authMiddleware,
  AdminMiddleware,
  getDonarListController
);
router.get(
  "/hospital-list",
  authMiddleware,
  AdminMiddleware,
  getHospitalListController
);
router.get("/org-list", authMiddleware, AdminMiddleware, getOrgListController);

//delete list route
router.delete(
  "/delete-donar/:id",
  authMiddleware,
  AdminMiddleware,
  deleteListController
);
router.delete(
  "/delete-hospital/:id",
  authMiddleware,
  AdminMiddleware,
  deleteListController
);
router.delete(
  "/delete-organisation/:id",
  authMiddleware,
  AdminMiddleware,
  deleteListController
);

module.exports = router;
