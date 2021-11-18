const express = require("express");
const router = express.Router();
const AuthController = require("../controller/Auth");
const {
  validateApiKey,
  validateSignupApi,
  validateLoginApi,
} = require("../middleware/AuthUser");
router.use(validateApiKey);

router.post("/signup", validateSignupApi, function (req, res, next) {
  AuthController.signup(req, res, next);
});

router.post("/login", validateLoginApi, function (req, res, next) {
  AuthController.login(req, res, next);
});

module.exports = router;
