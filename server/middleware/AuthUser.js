const userService = require('../services/users')
const User = require('../models/User')
const userRoleArray = ['BRANCH', 'CLIENT', 'USER']

validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  if (!apiKey) {
    return res.status(403).send({
      message: 'No api key provided!',
    })
  }
  if (process.env.apiKey !== apiKey) {
    return res.status(403).send({
      message: 'Wrong api key provided!',
    })
  }
  next()
}

validateSignupApi = (req, res, next) => {
  const body = req.body
  if (!body.name) {
    return res.status(400).send({
      message: 'Name is required!',
    })
  }
  if (!body.email) {
    return res.status(400).send({
      message: 'Email is required!',
    })
  }
  const pattern = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/
  if (!pattern.test(body.email)) {
    return res.status(400).send({
      message: 'Invalid email pattern!',
    })
  }
  if (!body.password) {
    return res.status(400).send({
      message: 'Password is required!',
    })
  }

  if (!body.role) {
    return res.status(400).send({
      message: 'User role is required!',
    })
  }
  if (!userRoleArray.includes(body.role)) {
    return res.status(400).send({
      message: `User role must be one of ${userRoleArray}`,
    })
  }
  next()
}

validateLoginApi = (req, res, next) => {
  const body = req.body
  if (!body.email) {
    return res.status(400).send({
      message: 'Email is required!',
    })
  }
  const pattern = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/
  if (!pattern.test(body.email)) {
    return res.status(400).send({
      message: 'Invalid email pattern!',
    })
  }
  if (!body.password) {
    return res.status(400).send({
      message: 'Password is required!',
    })
  }
  next()
}

validateUserAccessToken = async (req, res, next) => {
  const token = await userService.parseBearer(
    req.headers['authorization'] || '',
  )
  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    })
  }
  const decodedData = await userService.verifyUserToken(
    token,
    process.env.userAccessTokenSecret,
  )
  console.log(decodedData, 'userDetails')

  if (!decodedData) {
    return res.status(401).send({
      message: 'Unauthorized Access',
    })
  } else {
    User.getUserById(decodedData.id, async function (err, userDetails) {
      if (err) {
        return res.json(err)
      } else {
        if (userDetails && userDetails.length !== 1) {
          return res.status(401).send({
            message: 'Unauthorized Access',
          })
        } else {
          userRoleArray.push('ADMIN')
          if (!userRoleArray.includes(userDetails[0].role)) {
            return res.status(401).send({
              message: 'Unauthorized Access',
            })
          }
          if (userDetails[0].role !== 'ADMIN') {
            const accessibility = await userService.checkAccessibility(
              userDetails[0].startDate,
              userDetails[0].endDate,
            )
            if (!accessibility) {
              return res.status(401).send({
                message:
                  'You are not authorized to be loggedin, Please contact with admin panel!',
              })
            }
          }
          req['userDetails'] = {
            id: userDetails[0].id,
            name: userDetails[0].name,
            email: userDetails[0].email,
            role: userDetails[0].role,
          }
          next()
        }
      }
    })
  }
}

validateOTPVerification = (req, res, next) => {
  const body = req.body
  if (!body.email) {
    return res.status(400).send({
      message: 'Email is required!',
    })
  }
  if (!body.otp) {
    return res.status(400).send({
      message: 'OTP is required!',
    })
  }
  next()
}

validateResendOTP = (req, res, next) => {
  const body = req.body
  if (!body.email) {
    return res.status(400).send({
      message: 'Email is required!',
    })
  }
  next()
}

const authUser = {
  validateApiKey: validateApiKey,
  validateSignupApi: validateSignupApi,
  validateLoginApi: validateLoginApi,
  validateUserAccessToken: validateUserAccessToken,
  validateOTPVerification: validateOTPVerification,
  validateResendOTP: validateResendOTP,
}
module.exports = authUser
