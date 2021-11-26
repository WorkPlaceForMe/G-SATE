const jwt = require('jsonwebtoken')
const moment = require('moment')

genrateUserTokens = (userDetails) => {
  const accessTokenExpiry = Number(process.env.accessTokenExpiry)

  const accessToken = jwt.sign(
    { id: userDetails.id, email: userDetails.email },
    process.env.userAccessTokenSecret,
    { expiresIn: accessTokenExpiry },
  )

  return {
    accessToken: accessToken,
    accessTokenExpiry: accessTokenExpiry,
    id: userDetails.id,
    email: userDetails.email,
  }
}

verifyUserToken = (token, tokenSecret) => {
  try {
    const decoded = jwt.verify(token, tokenSecret)
    return decoded
  } catch (err) {
    return false
  }
}

parseBearer = (bearer) => {
  const [_, token] = bearer.trim().split(' ')
  return token
}

checkAccessibility = (startTime, endTime) => {
  const format = 'YYYY-MM-DD HH:mm:ss'
  const currentDateTime = moment().format(format)
  const startDateTime = moment(new Date(startTime)).format(format)
  const endDateTime = moment(new Date(endTime)).format(format)

  if (moment(currentDateTime).isBetween(startDateTime, endDateTime)) {
    console.log('accessibility true')
    return true
  } else {
    console.log('accessibility false')
    return false
  }
}

const userService = {
  genrateUserTokens: genrateUserTokens,
  verifyUserToken: verifyUserToken,
  parseBearer: parseBearer,
  checkAccessibility: checkAccessibility,
}
module.exports = userService
