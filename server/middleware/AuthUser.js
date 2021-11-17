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

validateEmailAndPassword = (req, res, next) => {
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

const authUser = {
  validateApiKey: validateApiKey,
  validateEmailAndPassword: validateEmailAndPassword,
}
module.exports = authUser
