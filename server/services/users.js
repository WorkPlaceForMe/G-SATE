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

const userService = {
  genrateUserTokens: genrateUserTokens,
  verifyUserToken: verifyUserToken,
  parseBearer: parseBearer,
}
module.exports = userService
