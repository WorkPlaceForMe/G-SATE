const User = require('../models/User')
const moment = require('moment')
const bcrypt = require('bcrypt')
const userService = require('../services/users')
const { v4: uuidv4 } = require('uuid')

let Auth = {
  signup: async (req, res) => {
    const body = req.body
    try {
      User.getUserByEmail(body.email, async function (err, data) {
        if (err) {
          return res.json(err)
        } else {
          if (data && data.length !== 0) {
            return res.status(400).send({
              message: 'Provided email is already registered!',
            })
          } else {
            const bcryptedPassword = await bcrypt.hash(
              body.password,
              Number(process.env.passwordSaltRound),
            )
            console.log(uuidv4(), '............')
            const userData = {
              uuid: uuidv4(),
              name: body.name || '',
              email: body.email,
              password: bcryptedPassword,
              mobileNumber: body.mobileNumber || '',
              address: body.address || '',
              createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            }
            console.log(userData)
            User.createNewUser(userData, function (err, userCreated) {
              if (err) {
                return res.json(err)
              } else {
                res.status(200).json({
                  message: 'You have registered successfully',
                })
              }
            })
          }
        }
      })
    } catch (e) {
      console.log('error', e)
    }
  },

  login: async (req, res) => {
    const reqBody = req.body
    try {
      User.getUserByEmail(reqBody.email, async function (err, userDetails) {
        if (err) {
          return res.json(err)
        } else {
          if (userDetails && userDetails.length !== 1) {
            return res.status(400).send({
              message: 'Please provide your registered email address!',
            })
          } else {
            const isSame = await bcrypt.compare(
              reqBody.password,
              userDetails[0].password,
            )
            if (!isSame) {
              return res.status(400).send({
                message: 'Invalid password!',
              })
            } else {
              const tokenDetails = await userService.genrateUserTokens(
                userDetails,
              )
              const responseObj = {
                id: userDetails[0].id,
                name: userDetails[0].name,
                email: userDetails[0].email,
                uuid: userDetails[0].uuid,
                mobileNumber: userDetails[0].mobileNumber,
                address: userDetails[0].address,
                accessToken: tokenDetails.accessToken,
                accessTokenExpiry: tokenDetails.accessTokenExpiry,
                createdAt: userDetails[0].createdAt,
              }
              res.status(200).json(responseObj)
            }
          }
        }
      })
    } catch (e) {
      console.log('error', e)
    }
  },
}

module.exports = Auth
