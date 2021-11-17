const jwt = require('jsonwebtoken')

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

const userService = {
  genrateUserTokens: genrateUserTokens,
}
module.exports = userService
