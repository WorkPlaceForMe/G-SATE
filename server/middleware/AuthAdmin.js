const userService = require('../services/users')
const User = require('../models/User')
const moment = require('moment')
const Settings = require('../models/Settings')

validateAdminAccessToken = async (req, res, next) => {
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
  console.log(decodedData, 'adminDetails')

  if (!decodedData) {
    return res.status(401).send({
      message: 'Unauthorized Access',
    })
  } else {
    User.getAdminUserById(decodedData.id, function (err, adminDetails) {
      if (err) {
        return res.json(err)
      } else {
        if (adminDetails && adminDetails.length !== 1) {
          return res.status(401).send({
            message: 'Unauthorized Access',
          })
        } else {
          req['adminDetails'] = {
            id: adminDetails[0].id,
            name: adminDetails[0].name,
            email: adminDetails[0].email,
            role: adminDetails[0].role,
          }
          next()
        }
      }
    })
  }
}

validateUpdateAccessibility = async (req, res, next) => {
  const body = req.body
  const format = 'YYYY-MM-DD HH:mm:ss'
  if (!req.params.id) {
    return res.status(400).send({
      message: 'User id is required!',
    })
  }
  if (!body.startDate) {
    return res.status(400).send({
      message: 'Start date is required!',
    })
  }
  if (!body.endDate) {
    return res.status(400).send({
      message: 'End date is required!',
    })
  }
  if (!moment(body.startDate, format, true).isValid()) {
    return res.status(400).send({
      message: `Invalid start date format,pattern must be ${format}`,
    })
  }
  if (!moment(body.endDate, format, true).isValid()) {
    return res.status(400).send({
      message: `Invalid end date format,pattern must be ${format}`,
    })
  }

  const difference = moment(body.startDate, format).diff(
    moment(body.endDate, format),
  )
  if (difference > 0) {
    return res.status(400).send({
      message: 'End date must be greater than start date',
    })
  }

  next()
}

smtpDetails = (req, res, next) => {
  Settings.getSettingsDetailsByUser(async function (err, settings) {
    const credentials = {
      email: settings && settings.length > 0 ? settings[0].email : '',
      password: settings && settings.length > 0 ? settings[0].password : '',
    }
    req['smtpDetails'] = credentials
    next()
  })
}

const authAdmin = {
  validateAdminAccessToken: validateAdminAccessToken,
  validateUpdateAccessibility: validateUpdateAccessibility,
  smtpDetails: smtpDetails,
}
module.exports = authAdmin
