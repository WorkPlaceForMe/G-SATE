var express = require('express')
const { validateApiKey } = require('../middleware/AuthUser')
var router = express.Router()
var Home = require('../models/Home')
router.use(validateApiKey)

router.post('/contact', function (req, res, next) {
  const contactDetails = req.body
  const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/

  if (
    !contactDetails.name ||
    !contactDetails.email ||
    !contactDetails.subject ||
    !contactDetails.message
  ) {
    return res
      .status(400)
      .send({ message: 'All fields are required to save contact details.' })
  }

  if (!validEmailRegex.test(contactDetails.email)) {
    return res
      .status(400)
      .send({ message: 'Please enter a valid email address.' })
  }

  Home.createContactsTable(function (err, rows) {
    if (err) {
      res.json(err)
    } else {
      Home.createContacts(contactDetails, function (err, contact) {
        if (err) {
          res.json(err)
        } else {
          res.status(200).send({ message: 'Contact saved.' })
        }
      })
    }
  })
})

module.exports = router
