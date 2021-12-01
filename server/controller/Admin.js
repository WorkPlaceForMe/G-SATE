const User = require('../models/User')
const userRoleArray = ['BRANCH', 'CLIENT', 'USER']
const Settings = require('../models/Settings')

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
          } else if (!userRoleArray.includes(userDetails[0].role)) {
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

  addOrUpdateSMTPDetails: async (req, res) => {
    try {
      const adminDetails = req.adminDetails
      const reqBody = req.body
      Settings.createSettingsTable(function (err, rows) {
        if (err) {
          res.json(err)
        } else {
          Settings.getSettingsByAdminId(adminDetails.id, async function (
            err,
            settings,
          ) {
            if (err) {
              return res.json(err)
            } else {
              const settingsData = {
                adminId: adminDetails.id,
                email: reqBody.email,
                password: reqBody.password,
              }
              if (settings && settings.length === 0) {
                Settings.createSMTP(settingsData, function (err, created) {
                  if (err) {
                    return res.json(err)
                  } else {
                    res.status(200).send({
                      success: true,
                      message: 'SMTP details added successfully!',
                    })
                  }
                })
              } else if (settings && settings.length === 1) {
                Settings.updateSMTP(settingsData, function (err, created) {
                  if (err) {
                    return res.json(err)
                  } else {
                    res.status(200).send({
                      success: true,
                      message: 'SMTP details updated successfully!',
                    })
                  }
                })
              } else {
                return res.status(400).send({
                  message: 'Problem found!',
                })
              }
            }
          })
        }
      })
    } catch (e) {
      console.log('error', e)
    }
  },

  getSMTPDetails: async (req, res) => {
    try {
      const adminDetails = req.adminDetails

      Settings.getSettingsByAdminId(adminDetails.id, async function (
        err,
        settings,
      ) {
        if (err) {
          return res.json(err)
        } else {
          if (settings && settings.length > 1) {
            return res.status(400).send({
              message: 'Problem found!',
            })
          } else {
            const responseData = {
              email: settings.length === 1 ? settings[0].email : '',
              password: settings.length === 1 ? settings[0].password : '',
              createdAt: settings.length === 1 ? settings[0].createdAt : '',
              updatedAt: settings.length === 1 ? settings[0].updatedAt : '',
            }
            res.status(200).send(responseData)
          }
        }
      })
    } catch (e) {
      console.log('error', e)
    }
  },
}

module.exports = Admin
