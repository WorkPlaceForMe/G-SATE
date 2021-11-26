const User = require('../models/User')
const moment = require('moment')

let Admin = {
  getUsers: async (req, res) => {
    try {
      User.getUsersByAdmin(function (err, userDetails) {
        if (err) {
          return res.json(err)
        } else {
          res.status(200).json(userDetails)
        }
      })
    } catch (e) {
      console.log('error', e)
    }
  },

  updateUserAccessibility: async (req, res) => {
    try {
      const requestData = req.body
      console.log(requestData)
      User.getUserById(req.params.id, function (err, userDetails) {
        if (err) {
          return res.json(err)
        } else {
          if (userDetails && userDetails.length !== 1) {
            return res.status(400).send({
              message: 'User not exists',
            })
          } else if (userDetails[0].role !== 'OPERATOR') {
            return res.status(400).send({
              message: 'Can not do this action',
            })
          } else {
            const updateData = {
              id: userDetails[0].id,
              startDate: requestData.startDate,
              endDate: requestData.endDate,
            }
            console.log(updateData)
            User.updateAccessibility(updateData, function (err, updated) {
              if (err) {
                return res.json(err)
              } else {
                res.status(200).send({
                  success: true,
                  message: 'User accessibility updated successfully!',
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
}

module.exports = Admin
