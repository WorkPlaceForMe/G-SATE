const express = require('express')
const router = express.Router()
const AuthController = require('../controller/Auth')
const { smtpDetails } = require('../middleware/AuthAdmin')
const {
  validateApiKey,
  validateSignupApi,
  validateOTPVerification,
  validateResendOTP,
  validateEmailPassword,
} = require('../middleware/AuthUser')
router.use(validateApiKey)

router.post('/signup', validateSignupApi, smtpDetails, function (
  req,
  res,
  next,
) {
  AuthController.signup(req, res, next)
})

router.post('/verify-otp', validateOTPVerification, smtpDetails, function (
  req,
  res,
  next,
) {
  AuthController.verifyOTP(req, res, next)
})

router.put('/resend-otp', validateResendOTP, smtpDetails, function (
  req,
  res,
  next,
) {
  AuthController.resendOTP(req, res, next)
})

router.get('/verification-status/:email', function (req, res, next) {
  AuthController.verificationStatus(req, res, next)
})

router.post('/login', validateEmailPassword, function (req, res, next) {
  AuthController.login(req, res, next)
})

module.exports = router
