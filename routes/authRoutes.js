const express = require("express");
const {
  registerController,
  loginController,
  currentUserController,
} = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//register post request
router.post("/register", registerController);

//login post request
router.post("/login", loginController);

//get current user with token
router.get("/current-user", authMiddleware, currentUserController);

module.exports = router;
